import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('all seven practical lessons display complete explanations, examples and quizzes and award XP once', async ({
  page,
}) => {
  await page.goto('/teoria')
  await expect(page.getByText('17 lecciones abiertas:', { exact: false })).toBeVisible()
  const lessons = await page.evaluate(async () => {
    const path = '/packages/content/src/practicalTheory.ts'
    const { practicalLessons } = await import(/* @vite-ignore */ path)
    return practicalLessons.map(
      (lesson: {
        id: string
        name: string
        quiz: { question: string; options: string[]; answer: number }[]
      }) => ({
        id: lesson.id,
        name: lesson.name,
        answers: lesson.quiz.map((q) => q.options[q.answer]),
      }),
    )
  })
  for (const lesson of lessons) {
    await page.goto(`/teoria/${lesson.id}`)
    await expect(
      page.getByRole('heading', { level: 1, exact: true, name: lesson.name }),
    ).toBeVisible()
    await expect(page.locator('.lesson-body > .lesson-ideas > li')).toHaveCount(5)
    await expect(page.locator('.theory-explanation-section')).toHaveCount(3)
    await expect(page.locator('.theory-example-code .cm-editor')).toHaveCount(2)
    const complete = page.getByRole('button', { name: 'Completar lección · +40 XP', exact: true })
    await expect(complete).toBeDisabled()
    for (let i = 0; i < lesson.answers.length; i++)
      await page
        .locator('.quiz fieldset')
        .nth(i)
        .getByRole('radio', { name: lesson.answers[i], exact: true })
        .check()
    await page.getByRole('button', { name: 'Comprobar respuestas', exact: true }).click()
    await complete.click()
    await expect(
      page.getByRole('button', { name: '✓ Lección completada', exact: true }),
    ).toBeDisabled()
    await expect(page.locator('.theory-practice-links a')).not.toHaveCount(0)
  }
  await page.goto('/progreso')
  await expect(page.locator('.progress-xp .stat-number')).toHaveText('290')
  await expect(page.locator('.stats-grid')).toContainText('7/17')
  await page.goto('/teoria/m10')
  await expect(
    page.getByRole('button', { name: '✓ Lección completada', exact: true }),
  ).toBeDisabled()
})

test('the new examples apply real CSS, preserve table semantics and respond to viewport changes', async ({
  page,
}) => {
  await page.goto('/teoria/m10')
  let preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await expect(preview.locator('.tema-bosque a')).toHaveCSS('color', 'rgb(22, 101, 52)')
  await expect(preview.locator('.tarjeta:not(.tema-bosque) a')).toHaveCSS(
    'color',
    'rgb(67, 56, 202)',
  )
  await page.goto('/teoria/m12')
  preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await page.getByRole('combobox', { name: 'Ancho del ejemplo' }).selectOption('375')
  await expect(preview.locator('.menu')).toHaveCSS('flex-direction', 'column')
  await page.getByRole('combobox', { name: 'Ancho del ejemplo' }).selectOption('768')
  await expect(preview.locator('.menu')).toHaveCSS('flex-direction', 'row')
  await page.goto('/teoria/m13')
  preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await expect(preview.locator('th[scope="col"]')).toHaveCount(3)
  await expect(preview.locator('th[scope="row"]')).toHaveCount(3)
  await expect(preview.locator('.notas')).toHaveCSS('border-collapse', 'collapse')
  await page.goto('/teoria/m14')
  preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await preview.getByRole('textbox', { name: 'Correo', exact: true }).fill('incompleto')
  await expect(preview.locator('#correo')).toHaveCSS('border-color', 'rgb(185, 28, 28)')
  await preview.getByRole('textbox', { name: 'Correo', exact: true }).fill('a@example.org')
  await expect(preview.locator('#correo')).toHaveCSS('border-color', 'rgb(100, 116, 139)')
  await page.goto('/teoria/m15')
  preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await expect(preview.locator('.tarjetas')).toHaveCSS('display', 'flex')
  await expect(preview.locator('.tarjetas')).toHaveCSS('flex-wrap', 'wrap')
  await page.goto('/teoria/m16')
  await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
  preview = page.frameLocator('iframe[title^="Vista de teoría:"]')
  await page.getByRole('combobox', { name: 'Ancho del ejemplo' }).selectOption('1200')
  await expect
    .poll(
      async () =>
        (
          await preview
            .locator('.pagina')
            .evaluate((el) => getComputedStyle(el).gridTemplateColumns)
        ).split(' ').length,
    )
    .toBe(2)
  await page.getByRole('combobox', { name: 'Ancho del ejemplo' }).selectOption('375')
  await expect
    .poll(
      async () =>
        (
          await preview
            .locator('.pagina')
            .evaluate((el) => getComputedStyle(el).gridTemplateColumns)
        ).split(' ').length,
    )
    .toBe(1)
  await page
    .getByRole('textbox', { name: /^CSS del ejemplo:/ })
    .fill('.pagina { display: grid; gap: 2rem; }')
  await expect(preview.locator('.pagina')).toHaveCSS('gap', '32px')
  await page.getByRole('button', { name: 'Experimentar en el Laboratorio ↗', exact: true }).click()
  await expect(page).toHaveURL(/laboratorio#lab=/)
  await expect(page.getByRole('textbox', { name: 'HTML del ejercicio' })).toContainText('pagina')
  await expect(page.getByRole('textbox', { name: 'CSS del ejercicio' })).toContainText('gap: 2rem')
})

test('a practical theory lesson reflows and has no automated accessibility violations in either theme', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/teoria/m16')
  await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
  for (const label of ['Sistema', 'Claro']) {
    await page.getByRole('button', { name: `Cambiar tema. Tema actual: ${label}` }).click()
    await expect(page.locator('body')).toHaveCSS(
      'color',
      label === 'Sistema' ? 'rgb(26, 27, 46)' : 'rgb(236, 237, 247)',
    )
    const violations = (await new AxeBuilder({ page }).exclude('iframe').analyze()).violations
    expect(violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))).toEqual([])
  }
  await page.setViewportSize({ width: 320, height: 900 })
  await expect
    .poll(() =>
      page.evaluate(() => ({
        fits: document.documentElement.scrollWidth <= innerWidth,
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        overflow: Array.from(
          document.querySelectorAll(
            'main > *, .theory-design-example, .theory-preview-controls, .badge-celebration > *',
          ),
        )
          .filter((element) => element.getBoundingClientRect().right > innerWidth)
          .map((element) => ({
            class: element.className,
            right: element.getBoundingClientRect().right,
          })),
      })),
    )
    .toEqual({ fits: true, width: 320, scroll: 320, overflow: [] })
})
