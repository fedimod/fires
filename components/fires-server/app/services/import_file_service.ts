import Dataset from '#models/dataset'
import { inject } from '@adonisjs/core'
import SnapshotService from '#services/snapshot_service'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import DatasetChange, { ChangeType, RecommendedPolicy } from '#models/dataset_change'
import { entityKeyDomain } from '#validators/dataset_change'
import vine from '@vinejs/vine'

type Format = 'unknown' | 'mastodon' | 'fediblockhole' | 'values'
type Severity = 'suspend' | 'silence' | 'noop'

type ImportOptions = {
  defaultType: ChangeType
}

type ImportError = { success: false; error: string }
type ImportSuccess = {
  success: true
  unchanged: DatasetChange[]
  changed: DatasetChange[]
  new: DatasetChange[]
  missing: DatasetChange[]
}

type ImportResults = ImportError | ImportSuccess

type ImportRecord = {
  value: string
  severity: Severity
  reject_media?: boolean
  reject_reports?: boolean
  comment: string
}

function cleanInput(input: string): string {
  return input.toLowerCase().trim()
}

function parseSeverity(input: string): Severity {
  const value = cleanInput(input)

  if (value === 'suspend') {
    return 'suspend'
  }
  if (value === 'silence') {
    return 'silence'
  }

  return 'noop'
}

function parseBoolean(input: string): boolean | undefined {
  const value = cleanInput(input)
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }
  return undefined
}

const domainValidator = vine.compile(entityKeyDomain)

@inject()
export class ImportFileService {
  constructor(protected snapshotService: SnapshotService) {}

  async process(
    dataset: Dataset,
    filePath: string,
    options: ImportOptions
  ): Promise<ImportResults> {
    const snapshot = await this.snapshotService.getSnapshot(dataset.id)

    const parser = createReadStream(filePath, { encoding: 'utf-8' }).pipe(
      parse({
        delimiter: ',',
        encoding: 'utf-8',
        skipEmptyLines: true,
      })
    )

    const seen = new Set()
    const results: ImportResults = {
      success: true,
      unchanged: [],
      changed: [],
      new: [],
      missing: [],
    }

    let format: Format | undefined
    for await (const row of parser) {
      if (!format) {
        format = this.guessFormat(row)

        if (format === 'unknown') {
          return {
            success: false,
            error: 'Unknown CSV file format',
          }
        }

        // Drop the first row if mastodon or fediblockhole, since it's the header:
        if (format === 'fediblockhole' || format === 'mastodon') {
          continue
        }
      }

      const record = this.toRecord(row, format)
      if (record === null) {
        continue
      }

      const [error] = await domainValidator.tryValidate(record.value)
      if (error) {
        return {
          success: false,
          error: `Invalid domain in CSV file: ${record.value}`,
        }
      }

      const existing = snapshot.records.find((change) => {
        return change.entityKind === 'domain' && change.entityKey === record.value
      })

      if (!existing) {
        const proposed = new DatasetChange()
        const change = this.calculateChange(record, proposed, options.defaultType)

        results.new.push(change)
      } else {
        const change = this.calculateChange(record, existing, options.defaultType)

        if (change.$isNew && change.$isDirty) {
          results.changed.push(change)
        } else {
          results.unchanged.push(change)
        }
      }

      seen.add(`domain:${record.value}`)
    }

    results.missing = snapshot.records
      .filter((record) => {
        return !seen.has(`${record.entityKind}:${record.entityKey}`)
      })
      .map((record) => {
        return record.merge({ type: 'retraction' })
      })

    return results
  }

  private guessFormat(record: any): Format {
    if (!Array.isArray(record)) {
      return 'unknown'
    }

    if (record.length === 1) {
      return 'values'
    } else {
      // We only support importing domain data at the moment:
      if (record[0].trim() === 'domain') {
        return 'fediblockhole'
      } else if (record[0].trim() === '#domain') {
        return 'mastodon'
      }
    }

    return 'unknown'
  }

  // Converts a CSV row to a Mastodon-style domain block record:
  private toRecord(row: string[], format: Format): ImportRecord | null {
    const value = row[0].trim()
    if (value === '' || format === 'unknown') {
      return null
    }

    if (format === 'values') {
      // Remove .invalid and .test domains:
      if (value.endsWith('.invalid') || value.endsWith('.test')) {
        return null
      }

      return {
        value: value,
        severity: 'suspend',
        reject_media: false,
        reject_reports: false,
        comment: '',
      }
    }

    if (format === 'fediblockhole' || format === 'mastodon') {
      // Remove .invalid and .test domains:
      if (value.endsWith('.invalid') || value.endsWith('.test')) {
        return null
      }

      return {
        value: value,
        severity: parseSeverity(row[1]),
        reject_media: parseBoolean(row[2]),
        reject_reports: parseBoolean(row[3]),
        comment: cleanInput(row[4]),
      }
    }

    return null
  }

  private calculateChange(
    record: ImportRecord,
    change: DatasetChange,
    defaultType: ChangeType
  ): DatasetChange {
    const policy = this.calculatePolicy(record)

    change.merge({
      type: defaultType,
      entityKind: 'domain',
      entityKey: record.value,
      recommendedPolicy: policy,
      comment: record.comment,
    })

    const isUpdate = !change.$isNew && change.$isDirty
    const result = isUpdate ? new DatasetChange() : change
    if (isUpdate) {
      // Add in the extra properties:
      result.merge(change.serialize())
      result.$original = { ...change.$original }
    }

    return result
  }

  private calculatePolicy(record: ImportRecord): RecommendedPolicy {
    if (record.severity === 'suspend') {
      return 'drop'
    } else if (record.severity === 'silence') {
      return 'filter'
    } else if (record.severity === 'noop' && (record.reject_media || record.reject_reports)) {
      return 'filter'
    } else {
      return 'accept'
    }
  }
}
