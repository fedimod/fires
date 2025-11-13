import { column, BaseModel, beforeCreate } from '@adonisjs/lucid/orm'
import { TypedDecorator } from '@adonisjs/lucid/types/model'
import { Secret } from '@adonisjs/core/helpers'
import { v7 as uuidv7 } from 'uuid'
import type { UUIDv7 } from '#utils/uuid'

export const secretColumn = (): TypedDecorator<Secret<string>> => {
  return function (target: any, propertyKey: string) {
    const descriptor = {
      serializeAs: null,
      prepare: (value: Secret<string> | null) => value?.release() ?? null,
      consume: (value: string | null) => (value ? new Secret(value) : null),
    }

    column(descriptor)(target, propertyKey)
  }
}

// This is due to a quirk in Knex (which Lucid uses under the hood) and
// JSON/JSONB column handling: https://knexjs.org/guide/schema-builder.html#json
// We only need to stringify on write, we don't need to parse on read:
export const jsonArrayColumn = (): TypedDecorator<string[]> => {
  return function (target: any, propertyKey: string) {
    const descriptor = {
      prepare: (value: string[] | null) => (Array.isArray(value) ? JSON.stringify(value) : null),
      consume: (value: string[] | null) => (value ? value : null),
    }

    column(descriptor)(target, propertyKey)
  }
}

export class UuidBaseModel extends BaseModel {
  selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: UUIDv7

  @beforeCreate()
  static assignId(record: any) {
    record.id = uuidv7()
  }
}
