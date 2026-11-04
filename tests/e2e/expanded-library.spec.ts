import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('all expanded selector examples have real targets and all curriculum declarations are understood', async ({
  page,
}) => {
  await page.goto('/catalogo')
  const failures = await page.evaluate(async () => {
    const catPath = '/packages/content/src/catalog.ts'
    const domainPath = '/src/domain/challenges.ts'
    const previewPath = '/src/features/lab/model/selectorEvaluator.ts'
    const curriculumPath = '/packages/content/src/expandedCurriculum.ts'
    const { expandedEntries } = await import(/* @vite-ignore */ catPath)
    const { resolveSelector } = await import(/* @vite-ignore */ domainPath)
    const { sanitizeLabHtml } = await import(/* @vite-ignore */ previewPath)
    const { curriculumTopics, expandedLessons } = await import(/* @vite-ignore */ curriculumPath)
    const failures: string[] = []
    for (const item of expandedEntries) {
      try {
        const doc = new DOMParser().parseFromString(sanitizeLabHtml(item.html), 'text/html')
        if (!doc.querySelectorAll(resolveSelector(item.selector).selector).length)
          failures.push(item.id + ': no targets')
      } catch {
        failures.push(item.id + ': selector error')
      }
    }
    for (const topic of curriculumTopics) {
      const style = document.createElement('div').style
      style.cssText = topic.rule
      for (const prop of Array.from(topic.rule.matchAll(/([a-z-]+)\s*:/g), (match) => match[1]!))
        if (!style.getPropertyValue(prop)) failures.push(topic.slug + ': missing ' + prop)
    }
    for (const lesson of expandedLessons) {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(lesson.example.css)
      if (!sheet.cssRules.length) failures.push(lesson.id + ': no rules')
      if (
        !new DOMParser()
          .parseFromString(lesson.example.html, 'text/html')
          .querySelector(lesson.example.selector)
      )
        failures.push(lesson.id + ': no example target')
    }
    return failures
  })
  expect(failures).toEqual([])
})

test('hundred-item libraries filter by new categories and retain new favorites and completion', async ({
  page,
}) => {
  await page.goto('/catalogo')
  await expect(page.locator('.catalog-grid article')).toHaveCount(100)
  await page.getByRole('combobox', { name: 'Dificultad', exact: true }).selectOption('advanced')
  await expect(page.locator('.catalog-grid article')).not.toHaveCount(0)
  await page.getByRole('combobox', { name: 'Dificultad', exact: true }).selectOption('')
  await page.getByRole('combobox', { name: 'Compatibilidad', exact: true }).selectOption('recent')
  await expect(page.locator('.catalog-grid article')).not.toHaveCount(0)
  await page.getByRole('combobox', { name: 'Compatibilidad', exact: true }).selectOption('')
  await page.getByRole('combobox', { name: 'Categoría', exact: true }).selectOption('11')
  await expect(page.locator('.catalog-grid article')).toHaveCount(5)
  await page.getByRole('searchbox', { name: 'Buscar una ficha' }).fill('resumen')
  await expect(page.locator('.catalog-grid article')).toHaveCount(1)
  await page.getByRole('link', { name: 'Ver en acción →' }).click()
  await expect(page.getByRole('complementary', { name: 'Fichas de esta categoría' })).toBeVisible()
  await expect(
    page.getByRole('complementary', { name: 'Fichas de esta categoría' }).getByRole('link'),
  ).toHaveCount(5)
  await page.getByRole('link', { name: 'Todas las fichas' }).click()
  await page.getByRole('button', { name: 'Favorito: Celdas del resumen', exact: true }).click()
  await page.reload()
  await page.getByRole('checkbox', { name: 'Solo favoritos' }).check()
  await expect(page.locator('.catalog-grid article')).toHaveCount(1)
  await page.goto('/teoria')
  await expect(page.locator('.module-card')).toHaveCount(100)
  await page
    .getByRole('combobox', { name: 'Categoría de teoría', exact: true })
    .selectOption('Grid avanzado')
  await expect(page.locator('.module-card')).toHaveCount(5)
  await page.getByRole('searchbox', { name: 'Buscar lecciones' }).fill('Filas implícitas')
  await expect(page.locator('.module-card')).toHaveCount(1)
  await page.goto('/teoria/m99')
  await expect(
    page.getByRole('heading', { name: 'Preparar una página para imprimir', exact: true }),
  ).toBeVisible()
  await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
  const answers = await page.evaluate(async () => {
    const path = '/packages/content/src/theory.ts'
    const { lessons } = await import(/* @vite-ignore */ path)
    return lessons
      .find((item: { id: string }) => item.id === 'm99')
      .quiz.map((q: { options: string[]; answer: number }) => q.options[q.answer])
  })
  for (let i = 0; i < answers.length; i++)
    await page
      .locator('.quiz fieldset')
      .nth(i)
      .getByRole('radio', { name: answers[i], exact: true })
      .check()
  await page.getByRole('button', { name: 'Comprobar respuestas', exact: true }).click()
  await page.getByRole('button', { name: 'Completar lección · +40 XP', exact: true }).click()
  await page.goto('/progreso')
  await expect(page.locator('.stats-grid')).toContainText('1/100')
  await page.goto('/teoria')
  await page
    .getByRole('combobox', { name: 'Estado de la lección', exact: true })
    .selectOption('completed')
  await expect(page.locator('.module-card')).toHaveCount(1)
})

test('ten additional laboratory templates load HTML, CSS and meaningful selections with undo', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  const templates = await page.evaluate(async () => {
    const path = '/src/features/lab/model/extraLabTemplates.ts'
    const { extraLabTemplates } = await import(/* @vite-ignore */ path)
    return extraLabTemplates.map((item: { id: string; selector: string }) => ({
      id: item.id,
      selector: item.selector,
    }))
  })
  await expect(
    page.getByRole('combobox', { name: 'Plantilla HTML' }).locator('option'),
  ).toHaveCount(16)
  for (const template of templates) {
    await page.getByRole('combobox', { name: 'Plantilla HTML' }).selectOption(template.id)
    await expect(page.getByRole('textbox', { name: 'Selector que quieres probar' })).toHaveValue(
      template.selector,
    )
    await expect(page.locator('.lab-result-count')).not.toHaveText('0')
    await expect(
      page
        .frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
        .locator(template.selector)
        .first(),
    ).toBeAttached()
  }
  await page.getByRole('combobox', { name: 'Plantilla HTML' }).selectOption('responsive-menu')
  const frame = page.frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
  await expect(frame.locator('.menu ul')).toHaveCSS('display', 'flex')
  await page.getByRole('combobox', { name: 'Plantilla HTML' }).selectOption('grid-gallery')
  await expect(frame.locator('.galeria')).toHaveCSS('display', 'grid')
  await expect(frame.locator('.galeria')).not.toHaveCSS('grid-template-columns', 'none')
  await page.getByRole('button', { name: 'Deshacer', exact: true }).click()
  await expect(
    page.getByRole('textbox', { name: 'HTML del ejercicio', exact: true }),
  ).toContainText('Un menú que se adapta')
})

test('expanded theory and catalogue remain accessible and fit a 320px viewport', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  for (const url of ['/teoria', '/catalogo', '/teoria/m96', '/propiedades/prop-espacio-3d']) {
    await page.goto(url)
    await expect(page.locator('h1')).toBeVisible()
    if (url === '/teoria/m96')
      await expect(page.locator('.theory-design-example')).toHaveAttribute('aria-busy', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
    expect((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations).toEqual([])
  }
})
