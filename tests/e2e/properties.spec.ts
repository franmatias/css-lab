import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('all property solutions pass actual browser grading, starters fail, aliases work and missing frames fail', async ({
  page,
}) => {
  await page.goto('/propiedades')
  await expect(page.getByRole('heading', { name: 'Propiedades CSS', exact: true })).toBeVisible()
  const results = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/properties.ts'
    const graderPath = '/src/domain/propertyExercise.ts'
    const { propertyExercises } = await import(/* @vite-ignore */ contentPath)
    const { checkProperty } = await import(/* @vite-ignore */ graderPath)
    const failures: string[] = []
    for (const item of propertyExercises) {
      const solved = await checkProperty(item, item.solution)
      if (!solved.every((check: { correct: boolean }) => check.correct))
        failures.push(
          item.id +
            ': solution ' +
            JSON.stringify(solved.filter((check: { correct: boolean }) => !check.correct)),
        )
      const empty = await checkProperty(item, item.starter)
      if (empty.every((check: { correct: boolean }) => check.correct))
        failures.push(item.id + ': starter accepted')
    }
    const margin = propertyExercises.find((item: { id: string }) => item.id === 'margen')
    const alias = await checkProperty(
      margin,
      '.muestra { margin-top: 24px; margin-right: 24px; margin-bottom: 24px; margin-left: 24px; }',
    )
    const overridden = await checkProperty(
      margin,
      '.muestra { margin: 24px; } .muestra { margin-left: 0; }',
    )
    const frames = propertyExercises.find((item: { id: string }) => item.id === 'fotogramas')
    const missing = await checkProperty(
      frames,
      '.muestra { animation: entrada 2s infinite alternate; }',
    )
    let blocked = false
    try {
      await checkProperty(margin, '@import "https://example.com/x.css";')
    } catch {
      blocked = true
    }
    return {
      failures,
      alias: alias.every((check: { correct: boolean }) => check.correct),
      overridden: overridden.every((check: { correct: boolean }) => check.correct),
      missing: missing.every((check: { correct: boolean }) => check.correct),
      blocked,
      leaked: document.querySelectorAll('iframe[aria-hidden="true"]').length,
    }
  })
  expect(results).toEqual({
    failures: [],
    alias: true,
    overridden: false,
    missing: false,
    blocked: true,
    leaked: 0,
  })
})

test('properties catalog, editor, persistent completion, DOM selection and responsive preview work together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 })
  await page.goto('/propiedades')
  await expect(page.locator('.property-card')).toHaveCount(36)
  await page
    .getByRole('combobox', { name: 'Tema', exact: true })
    .selectOption('Sombras y transparencia')
  await expect(page.locator('.property-card')).toHaveCount(3)
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('')
  await page.getByRole('searchbox', { name: 'Buscar propiedades' }).fill('margen')
  await page.locator('.property-card').click()
  const source = page.getByRole('textbox', { name: 'HTML del ejemplo', exact: true })
  await expect(source).toHaveAttribute('aria-readonly', 'true')
  const editor = page.getByRole('textbox', { name: 'Tu CSS', exact: true })
  await editor.fill('.muestra { margin: 24px; }')
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click()
  await expect(page.locator('.property-validation [role="status"]')).toContainText('+60 XP')
  await expect(page.getByText('4/4 comprobados')).toBeVisible()
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click()
  await expect(page.locator('.property-validation [role="status"]')).toContainText(
    'ya estaba completado',
  )
  const node = page
    .locator('.property-dom')
    .getByRole('button', { name: /<article class="muestra">/ })
  await node.click()
  await page.mouse.move(10, 100)
  const preview = page.frameLocator('iframe[title="Resultado de propiedades"]')
  await expect(preview.locator('[data-csslab-inspection-caption]')).toHaveText('article.muestra')
  await expect(node).toHaveAttribute('aria-pressed', 'true')
  await node.click()
  await expect(node).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('button', { name: '375 px', exact: true }).click()
  await expect(page.locator('iframe[title="Resultado de propiedades"]')).toHaveJSProperty(
    'clientWidth',
    375,
  )
  await expect(page.locator('iframe[title="Resultado de propiedades"]')).toHaveAttribute(
    'sandbox',
    '',
  )
  await page.reload()
  await expect(editor).toContainText('margin: 24px')
  await expect(page.getByText('✓ Conquistado')).toBeVisible()
  await page.goto('/progreso')
  await expect(page.locator('.property-progress-card')).toContainText('1 / 36')
  await expect(page.locator('.progress-xp .stat-number')).toHaveText('70')
})

test('eight new theory lessons have experiments and quizzes and maintain completion', async ({
  page,
}) => {
  await page.goto('/teoria')
  const lessons = await page.evaluate(async () => {
    const path = '/packages/content/src/theory.ts'
    const { additionalLessons } = await import(/* @vite-ignore */ path)
    return additionalLessons.map(
      (item: { id: string; name: string; quiz: { options: string[]; answer: number }[] }) => ({
        id: item.id,
        name: item.name,
        answers: item.quiz.map((q) => q.options[q.answer]),
      }),
    )
  })
  expect(lessons).toHaveLength(8)
  for (const item of lessons) {
    await page.goto('/teoria/' + item.id)
    await expect(
      page.getByRole('heading', { name: item.name, level: 1, exact: true }),
    ).toBeVisible()
    await expect(page.locator('.theory-explanation-section')).toHaveCount(3)
    await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
    for (let i = 0; i < item.answers.length; i++)
      await page
        .locator('.quiz fieldset')
        .nth(i)
        .getByRole('radio', { name: item.answers[i], exact: true })
        .check()
    await page.getByRole('button', { name: 'Comprobar respuestas', exact: true }).click()
    await page.getByRole('button', { name: 'Completar lección · +40 XP', exact: true }).click()
    await expect(
      page.getByRole('button', { name: '✓ Lección completada', exact: true }),
    ).toBeDisabled()
  }
  await page.goto('/progreso')
  await expect(page.locator('.stats-grid')).toContainText('8/25')
  await expect(page.locator('.progress-xp .stat-number')).toHaveText('330')
})

test('home, footer and properties are accessible in both themes and at narrow widths', async ({
  page,
}) => {
  test.setTimeout(90_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Da forma a tus ideas con CSS.' })).toBeVisible()
  await expect(page.locator('.footer-institution')).toHaveText(
    'IEZV - Departamento Informática y IAD',
  )
  await expect(page.locator('.home-effects-links a')).toHaveCount(4)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Menú responsive' })
    .getByRole('link', { name: 'Propiedades', exact: true })
    .click()
  await expect(page.locator('.property-card')).toHaveCount(36)
  for (const url of ['/propiedades', '/propiedades/transicion-color', '/teoria/m23']) {
    await page.goto(url)
    await expect(page.locator('h1')).toBeVisible()
    if (url.includes('/teoria/'))
      await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
    for (const theme of ['light', 'dark']) {
      // Use the visible theme control to reach the intended theme regardless of OS preference.
      for (
        let attempt = 0;
        attempt < 3 && (await page.locator('html').getAttribute('data-theme')) !== theme;
        attempt++
      )
        await page.getByRole('button', { name: /Cambiar tema/ }).click()
      const audit = await new AxeBuilder({ page })
        // The preview sandbox intentionally prohibits injected scripts, including axe.
        // Example markup and computed output are checked in the exercise tests above.
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      expect(audit.violations).toEqual([])
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
    }
    await page.setViewportSize({ width: 320, height: 900 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
  }
})
