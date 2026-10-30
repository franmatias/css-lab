import { expect, it } from 'vitest'
import { lessons } from '../../packages/content/src'
import { practicalLessons, theoryLessonSchema } from '../../packages/content/src/practicalTheory'
it('extends the theory route with seven complete, validated lessons and preserves old identifiers', () => {
  expect(lessons.map((l) => l.id)).toEqual(Array.from({ length: 17 }, (_, i) => `m${i}`))
  for (const lesson of lessons) expect(theoryLessonSchema.safeParse(lesson).success).toBe(true)
  expect(practicalLessons).toHaveLength(7)
  for (const lesson of practicalLessons) {
    expect(lesson.ideas).toHaveLength(5)
    expect(lesson.sections).toHaveLength(3)
    expect(lesson.quiz).toHaveLength(3)
    expect(lesson.example?.html.length).toBeGreaterThan(100)
    expect(lesson.example?.css.length).toBeGreaterThan(100)
    expect(lesson.links!.length).toBeGreaterThanOrEqual(2)
    for (const question of lesson.quiz) expect(question.options[question.answer]).toBeTruthy()
  }
})
