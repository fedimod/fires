import factory from '@adonisjs/lucid/factories'
import stringHelpers from '@adonisjs/core/helpers/string'
import { v7 as uuidv7 } from 'uuid'

import Dataset from '#models/dataset'

export const DatasetFactory = factory
  .define(Dataset, async ({ faker }) => {
    const name = faker.lorem.words(5)
    return {
      id: uuidv7(),
      name: name,
      slug: stringHelpers.slug(name),
      summary: faker.lorem.sentence({ min: 1, max: 3 }),
      description: faker.lorem.paragraphs(3),
      locale: faker.helpers.arrayElement(['en-US', 'de-DE', 'pt-PT']),
    }
  })
  .build()
