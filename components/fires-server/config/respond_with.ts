import { defineConfig } from '@thisismissem/adonisjs-respond-with'

export default defineConfig({
  defaultHandler: 'error',
  mappings: {
    'application/ld+json': 'json',
  },
})
