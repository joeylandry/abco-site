import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentActions, newDocumentOptions, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'ABCo',

  projectId: 'snc0otcc',
  dataset: 'production',

  document: {
    actions: documentActions,
    newDocumentOptions,
  },

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
