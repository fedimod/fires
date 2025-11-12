import { test } from '@japa/runner'
import { fixturePath } from '#tests/helpers/fixtures'
import app from '@adonisjs/core/services/app'
import { ImportFileService } from '#services/import_file_service'
import Dataset from '#models/dataset'
import Label from '#models/label'
import { randomUUID } from 'node:crypto'

test.group('ImportFileService', (group) => {
  let dataset: Dataset
  let labels: Label[]
  group.each.setup(async () => {
    dataset = await Dataset.create({ name: `Test: ${randomUUID()}`, locale: 'en' })
    labels = await Label.createMany([
      {
        name: 'hate-speech',
        slug: 'hate-speech',
        locale: 'en',
      },
      {
        name: 'Online Harassment',
        slug: 'online-harassment',
        locale: 'en',
      },
    ])
  })
  group.each.teardown(async () => {
    await Dataset.query().delete()
    await Label.query().delete()
  })

  test('Imports into an empty dataset - {filename}')
    .with([
      { filename: 'domain-only.csv', changes: 7 },
      { filename: 'fediblockhole.csv', changes: 4 },
      // mastodon.csv contains ap.invalid, which is a canary domain, so it
      // actually contains 4 records not 5:
      { filename: 'mastodon.csv', changes: 4 },
    ])
    .run(async ({ assert }, data) => {
      const importer = await app.container.make(ImportFileService)
      const filepath = fixturePath(`import/${data.filename}`)

      const results = await importer.process(dataset, filepath, {
        defaultType: 'recommendation',
      })

      assert.ok(results.success)
      if (!results.success) return // yay bad type narrowing:

      assert.equal(results.new.length, data.changes)
    })
})
