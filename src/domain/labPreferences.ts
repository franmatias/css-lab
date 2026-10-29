import { z } from 'zod'

export const labPreferencesSchema = z.object({
  highlight: z.enum(['border', 'fill', 'both', 'none']).default('both'),
  color: z.enum(['amber', 'indigo', 'cyan']).default('amber'),
  numbers: z.boolean().default(false),
  grid: z.boolean().default(false),
  animations: z.boolean().default(true),
  live: z.boolean().default(true),
  background: z.enum(['light', 'dark', 'checker']).default('light'),
  width: z.enum(['auto', '375', '768']).default('auto'),
  fontSize: z.number().int().min(12).max(18).default(14),
  wrap: z.boolean().default(true),
  useTabs: z.boolean().default(false),
  tabWidth: z.union([z.literal(2), z.literal(4)]).default(2),
  layout: z.enum(['balanced', 'code', 'preview']).default('balanced'),
  collapsed: z
    .object({
      html: z.boolean().default(false),
      css: z.boolean().default(false),
      preview: z.boolean().default(false),
      tree: z.boolean().default(false),
    })
    .default({}),
})
export type LabPreferences = z.infer<typeof labPreferencesSchema>
