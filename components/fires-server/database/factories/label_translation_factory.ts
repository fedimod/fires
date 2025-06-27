import factory from '@adonisjs/lucid/factories'
import LabelTranslation from '#models/label_translation'
import { v7 as uuidv7 } from 'uuid'
import { LabelFactory } from './label_factory.js'

export const LabelTranslationFactory = factory
  .define(LabelTranslation, async ({ faker }) => {
    return {
      id: uuidv7(),
      name: faker.lorem.words(5),
      locale: faker.helpers.arrayElement(['en-US', 'de-DE', 'pt-PT']),
      summary: faker.lorem.sentence({ min: 1, max: 3 }),
      description: faker.lorem.paragraphs(3),
    }
  })
  .relation('label', () => LabelFactory)
  .build()
