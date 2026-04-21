import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {dashboardTool} from './plugins/DashboardTool'

export default defineConfig({
  name: 'default',
  title: 'SAYPO-BlogPosts',
  projectId: '30pkvaqq',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), dashboardTool()],
  schema: {
    types: schemaTypes,
  },
})
