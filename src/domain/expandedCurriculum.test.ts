import { expect, it } from 'vitest'
import { entries, expandedEntries, moduleNames } from '../../packages/content/src/catalog'
import { lessons, theoryCategories } from '../../packages/content/src/theory'
import { theoryLessonSchema } from '../../packages/content/src/practicalTheory'
import { propertyExercises } from '../../packages/content/src/properties'
import { propertyIds, additionalTheoryIds } from '../../packages/content/src/propertyProgress'
import { catalogCount, curriculumSlugs } from '../../packages/content/src/curriculumIds'
import { curriculumTopics, expandedLessons } from '../../packages/content/src/expandedCurriculum'
import { entrySchema } from '../../packages/content/src'
import { extraLabTemplates } from '../features/lab/model/extraLabTemplates'
it('provides 100 unique lessons, properties and catalogue cards with stable metadata and valid links', () => {
  expect(entries).toHaveLength(100)
  expect(propertyExercises).toHaveLength(100)
  expect(lessons.map((lesson) => lesson.id)).toEqual(Array.from({ length: 100 }, (_, i) => 'm' + i))
  expect(propertyIds).toEqual(propertyExercises.map((item) => item.id))
  expect(catalogCount).toBe(entries.length)
  expect(additionalTheoryIds).toEqual(lessons.slice(17).map((item) => item.id))
  expect(curriculumSlugs).toEqual(curriculumTopics.map((item) => item.slug))
  expect(moduleNames).toHaveLength(20)
  expect(theoryCategories.length).toBeGreaterThan(15)
  for (const items of [entries, lessons, propertyExercises])
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
  for (const entry of entries) expect(entrySchema.safeParse(entry).success).toBe(true)
  for (const lesson of lessons) expect(theoryLessonSchema.safeParse(lesson).success).toBe(true)
  for (const item of propertyExercises)
    expect(lessons.some((lesson) => item.theory === '/teoria/' + lesson.id)).toBe(true)
  expect(expandedEntries).toHaveLength(49)
  expect(expandedLessons).toHaveLength(75)
  for (const lesson of expandedLessons) {
    expect(lesson.ideas).toHaveLength(5)
    expect(lesson.sections).toHaveLength(3)
    expect(lesson.example?.steps).toHaveLength(3)
    expect(lesson.quiz.length).toBeGreaterThanOrEqual(2)
    for (const question of lesson.quiz) expect(new Set(question.options).size).toBe(3)
    for (const link of lesson.links ?? [])
      if (link.to.startsWith('/propiedades/'))
        expect(propertyIds).toContain(link.to.split('/').at(-1))
  }
  expect(extraLabTemplates).toHaveLength(10)
  expect(new Set(extraLabTemplates.map((item) => item.id)).size).toBe(10)
})
