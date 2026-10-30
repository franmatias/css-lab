import { z } from 'zod'

const resultSchema = z.object({
  attempts: z.number().int().nonnegative(),
  hintsUsed: z.number().int().min(0).max(3),
  status: z.enum(['in_progress', 'completed', 'skipped']),
  bestScore: z.number().nonnegative().default(0),
  completedAt: z.string().optional(),
  reviewBox: z.number().int().min(1).max(5).default(1),
  nextReviewAt: z.string().default(''),
})
export const learningSchema = z.object({
  xp: z.number().int().nonnegative().default(0),
  lessons: z.record(z.string()).default({}),
  challenges: z.record(resultSchema).default({}),
  workshops: z
    .record(
      z.object({
        css: z.string().max(20_000),
        answer: z.string().max(1).default(''),
        completedAt: z.string().optional(),
        steps: z.array(z.string().max(40)).max(32).default([]),
      }),
    )
    .default({}),
  games: z
    .record(
      z.object({
        attempts: z.number().int().nonnegative(),
        hintsUsed: z.number().int().min(0).max(3),
        draft: z.string().max(20_000).optional(),
        status: z.enum(['in_progress', 'completed']),
        bestScore: z.number().int().nonnegative(),
        completedAt: z.string().optional(),
      }),
    )
    .default({}),
  activity: z.record(z.number().int().nonnegative()).default({}),
  streak: z
    .object({
      current: z.number().int().nonnegative(),
      best: z.number().int().nonnegative(),
      lastActiveDate: z.string(),
      graceWeek: z.string().default(''),
    })
    .default({ current: 0, best: 0, lastActiveDate: '', graceWeek: '' }),
  badges: z.record(z.string()).default({}),
  favorites: z.array(z.string()).default([]),
  visits: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),
  settings: z
    .object({
      dailyGoal: z.number().int().min(1).max(3).default(1),
      celebrations: z.boolean().default(true),
      contrast: z.boolean().default(false),
      readingFont: z.boolean().default(false),
    })
    .default({}),
  exportedAt: z.string().default(''),
})
export type LearningData = z.infer<typeof learningSchema>
