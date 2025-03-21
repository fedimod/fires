import factory from '@adonisjs/lucid/factories'
import Label from '#models/label'
import { v7 as uuidv7 } from 'uuid'
import { DateTime } from 'luxon'

export const LabelFactory = factory
  .define(Label, async ({ faker }) => {
    return {
      id: uuidv7(),
      name: faker.lorem.words(5),
      language: faker.helpers.arrayElement(['en', 'de', 'pt-PT']),
      summary: faker.lorem.sentence({ min: 1, max: 3 }),
      description: faker.lorem.paragraphs(3),
      deprecatedAt: null,
    }
  })
  .state('deprecated', (label) => (label.deprecatedAt = DateTime.now().minus({ days: 5 })))
  .build()
