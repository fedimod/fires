import archiver from 'archiver'
import logger from '@adonisjs/core/services/logger'
import { inject } from '@adonisjs/core'
import { Readable } from 'node:stream'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { ColumnOption, Stringifier } from 'csv-stringify'

import UrlService from '#services/url_service'
import SnapshotService from '#services/snapshot_service'
import Dataset from '#models/dataset'
import { RecommendedFilters, RecommendedPolicy } from '#models/dataset_change'

import {
  DomainBlockRecord,
  DomainAllowRecord,
  DomainSeverity,
  DomainRetractionRecord,
} from '#utils/csv_types'

type ExportOptions = {
  signal: AbortSignal
}

type ExportZipResult =
  | {
      success: true
      archivePath: string
      filename: string
      changeId: string
    }
  | {
      success: false
      aborted: boolean
      message: string
      empty: boolean
    }

type CsvExporter<T> = {
  write(record: T): Promise<void>
  finish(dispose?: boolean): Promise<string>
}

type DomainPolicy = {
  severity: DomainSeverity
  reject_media: boolean
  reject_reports: boolean
}

@inject()
export class ExportDatasetService {
  constructor(protected snapshotService: SnapshotService) {}

  private getTempPath() {
    return join(tmpdir(), randomUUID() + '.zip')
  }

  private errorResult(aborted: boolean, message: string): ExportZipResult {
    return {
      success: false,
      aborted,
      message,
      empty: false,
    }
  }

  async createZip(dataset: Dataset, options: ExportOptions): Promise<ExportZipResult> {
    const signal = options.signal

    const snapshot = await this.snapshotService.getSnapshot(dataset.id)
    const datasetUrl = UrlService.make('datasets.show', { slug: dataset.slug })
    const changeId = snapshot.latestChange

    // Bail out if there's no changes:
    if (!changeId) {
      return {
        success: false,
        aborted: false,
        message: "This dataset doesn't contain any changes",
        empty: true,
      }
    }

    const archiveFilename = `export-${dataset.slug}-${changeId}.zip`
    const archiveComment = `Export of ${datasetUrl} at ${changeId}`
    const publicComment = `Export ${datasetUrl} at ${changeId}`

    const domainRetractionList = this.createCsv<DomainRetractionRecord>([
      { key: 'domain', header: 'domain' },
      { key: 'comment', header: 'comment' },
    ])

    const domainAllowList = this.createCsv<DomainAllowRecord>([
      { key: 'domain', header: '#domain' },
    ])

    const domainDenyList = this.createCsv<DomainBlockRecord>([
      { key: 'domain', header: '#domain' },
      { key: 'severity', header: '#severity' },
      { key: 'reject_media', header: '#reject_media' },
      { key: 'reject_reports', header: '#reject_reports' },
      { key: 'public_comment', header: '#public_comment' },
      { key: 'obfuscate', header: '#obfuscate' },
    ])

    const state: { allows: boolean; denies: boolean; retractions: boolean } = {
      allows: false,
      denies: false,
      retractions: false,
    }

    for await (const record of snapshot.records) {
      if (record.entityKind === 'domain') {
        if (record.type === 'recommendation') {
          // Skip records without policies, since these aren't recommendations:
          if (!record.recommendedPolicy) {
            continue
          }

          const policy = this.convertDomainPolicy(
            record.recommendedPolicy,
            record.recommendedFilter
          )

          if (record.recommendedPolicy === 'accept') {
            await domainAllowList.write({
              domain: record.entityKey,
            })
            state.allows = true
          } else {
            await domainDenyList.write({
              domain: record.entityKey,
              severity: policy.severity,
              reject_media: policy.reject_media,
              reject_reports: policy.reject_reports,
              public_comment: publicComment,
              obfuscate: false,
            })
            state.denies = true
          }
        } else if (record.type === 'retraction') {
          await domainRetractionList.write({
            domain: record.entityKey,
            comment: `Retracted ${record.createdAt.toISO()}`, // record.comment
          })
          state.retractions = true
        }
      }
    }

    try {
      const { archive, archivePath } = this.createArchive(archiveComment)
      logger.debug('Created archive: ' + archivePath)

      // Append the CSV files to the archive:
      if (state.allows) {
        const domainAllowListCsv = await domainAllowList.finish()
        archive.append(domainAllowListCsv, { name: 'domain-allowlist.csv' })
      } else {
        // dispose:
        domainAllowList.finish(true)
      }

      if (state.denies) {
        const domainDenyListCsv = await domainDenyList.finish()
        archive.append(domainDenyListCsv, { name: 'domain-denylist.csv' })
      } else {
        // dispose:
        domainDenyList.finish(true)
      }

      if (state.retractions) {
        const domainRetractionCsv = await domainRetractionList.finish()
        archive.append(domainRetractionCsv, { name: 'domain-retractions.csv' })
      } else {
        // dispose:
        domainRetractionList.finish(true)
      }

      // TODO Accounts / actors:
      // archive.append('string cheese!', { name: 'account-denylist.csv' })
      // archive.append('string cheese!', { name: 'account-retractions.csv' })

      if (signal.aborted) {
        return this.errorResult(true, 'Creation of zip file aborted.')
      }

      await archive.finalize()
      await streamFile(archive, archivePath, options.signal)

      return {
        success: true,
        archivePath,
        filename: archiveFilename,
        changeId,
      }
    } catch (err) {
      if (signal.aborted) {
        return this.errorResult(true, 'Creation aborted.')
      } else {
        logger.error(err, 'Error streaming zip file to disk')
        return this.errorResult(false, 'Error creating zip file')
      }
    }
  }

  createArchive(comment: string) {
    const archivePath = this.getTempPath()
    const archive = archiver.create('zip', {
      comment: comment,
      zlib: { level: 9 },
    })

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      logger.warn(err, `Warning when creating zip export`)
    })

    archive.on('error', (err) => {
      logger.error(err, `Error when creating zip export`)
      throw err
    })

    return {
      archive,
      archivePath,
    }
  }

  createCsv<T>(columns: ReadonlyArray<ColumnOption>): CsvExporter<T> {
    const csv = new Stringifier({
      objectMode: true,
      readableHighWaterMark: 20_000,
      cast: {
        // By default booleans seem to be output as 1 or 0:
        boolean: (value) => {
          if (value) {
            return 'true'
          } else {
            return 'false'
          }
        },
      },
      // quote strings containing spaces:
      quoted_match: ' ',
      header: true,
      columns,
    })

    return {
      write: (record: T): Promise<void> => {
        return new Promise((resolve) => {
          csv.write(record, (err) => {
            if (err) {
              logger.error(err, 'Error writing to CSV file')
              return resolve()
            }
            return resolve()
          })
        })
      },
      async finish(dispose: boolean): Promise<string> {
        csv.end()
        if (dispose) return ''

        const chunks: string[] = []
        for await (const row of csv) {
          chunks.push(row)
        }

        return Promise.resolve(chunks.join(''))
      },
    }
  }

  convertDomainPolicy(
    recommendedPolicy: RecommendedPolicy,
    _recommendedFilters: RecommendedFilters
  ): DomainPolicy {
    if (recommendedPolicy === 'accept') {
      return {
        severity: 'noop',
        reject_media: false,
        reject_reports: false,
      }
    }

    // TODO: Implement filters:
    if (recommendedPolicy === 'filter') {
      return {
        severity: 'noop',
        reject_media: false,
        reject_reports: false,
      }
    }

    // else recommendedPolicy === 'drop' || recommendedPolicy === 'reject'
    return {
      severity: 'suspend',
      reject_media: false,
      reject_reports: false,
    }
  }
}

export async function streamFile(
  readStream: Readable,
  location: string,
  signal: AbortSignal
): Promise<void> {
  const writeStream = createWriteStream(location)
  try {
    await pipeline(readStream, writeStream, { signal })
  } catch (error) {
    await unlink(writeStream.path).catch(() => {})
    throw error
  }
}
