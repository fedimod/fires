import factory from '@adonisjs/lucid/factories'
import Label from '#models/label'
import { v7 as uuidv7 } from 'uuid'
import { DateTime } from 'luxon'
import { LabelTranslationFactory } from '#database/factories/label_translation_factory'

export const LabelFactory = factory
  .define(Label, async ({ faker }) => {
    return {
      id: uuidv7(),
      name: faker.lorem.words(5),
      summary: faker.lorem.sentence({ min: 1, max: 3 }),
      description: faker.lorem.paragraphs(3),
      locale: faker.helpers.arrayElement(['en-US', 'de-DE', 'pt-PT']),
      deprecatedAt: null,
    }
  })
  .state('deprecated', (label) => (label.deprecatedAt = DateTime.now().minus({ days: 5 })))
  .relation('translations', () => LabelTranslationFactory)
  .build()
