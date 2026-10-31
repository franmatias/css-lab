import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('every workshop has a valid solution and incomplete or conditional declarations do not pass', async ({
  page,
}) => {
  await page.goto('/diseno')
  const errors = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/design.ts'
    const checkPath = '/src/domain/designWorkshop.ts'
    const { workshops } = await import(/* @vite-ignore */ contentPath)
    const { checkWorkshop } = await import(/* @vite-ignore */ checkPath)
    const errors: string[] = []
    for (const item of workshops) {
      const correct = checkWorkshop(item, `${item.baseCss}\n${item.solution}`, String(item.correct))
      if (!correct.declarations.every(Boolean) || !correct.quiz) errors.push(`${item.id}: solution`)
      if (
        checkWorkshop(
          item,
          `${item.baseCss}\n${item.starter}`,
          String(item.correct),
        ).declarations.every(Boolean)
      )
        errors.push(`${item.id}: starter`)
      if (
        checkWorkshop(
          item,
          `/* ${item.solution.replace(/\/\*[\s\S]*?\*\//g, '')} */`,
          '',
        ).declarations.some(Boolean)
      )
        errors.push(`${item.id}: comment`)
      if (
        checkWorkshop(
          item,
          `@supports (display: no-such-value) { ${item.solution} }`,
          '',
        ).declarations.some(Boolean)
      )
        errors.push(`${item.id}: false conditional`)
    }
    const item = workshops.find((item: { id: string }) => item.id === 'responsive')!
    if (
      checkWorkshop(item, '.pagina { grid-template-columns: 2fr 1fr; }', '1').declarations.some(
        Boolean,
      )
    )
      errors.push('responsive: missing media')
    const flex = workshops.find((item: { id: string }) => item.id === 'flexbox')!
    if (checkWorkshop(flex, `${flex.solution}\n.tarjetas { display: block; }`, '1').declarations[0])
      errors.push('overridden declaration')
    return errors
  })
  expect(errors).toEqual([])
  await expect(page.locator('.design-grid > article')).toHaveCount(12)
  await page.getByRole('combobox', { name: 'Categoría', exact: true }).selectOption('Organización')
  await expect(page.locator('.design-grid > article')).toHaveCount(2)
  await page.getByRole('link', { name: 'Componentes con nombres BEM', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Componentes con nombres BEM')
  await page.getByText('Otros talleres', { exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Recorrido de diseño' })
    .getByRole('link', { name: /Variables CSS/ })
    .click()
  await page.getByRole('textbox', { name: 'CSS del taller' }).press('Control+End')
  await expect(page.getByRole('textbox', { name: 'CSS del taller' })).toContainText('.tema-bosque')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Variables CSS y temas reutilizables',
  )
})

test('workshops save drafts, check CSS and quiz, award once, export to the lab and unlock badges', async ({
  page,
}) => {
  await page.goto('/diseno/flexbox')
  await page.getByRole('button', { name: 'He leído el objetivo' }).click()
  await page.getByRole('button', { name: /Comprueba distintos tamaños Por hacer/ }).click()
  await page.getByRole('button', { name: '1200', exact: true }).click()
  await page.getByRole('button', { name: 'He revisado ambas vistas' }).click()
  const editor = page.getByRole('textbox', { name: 'CSS del taller', exact: true })
  await editor.fill('.tarjetas { display: flex; flex-wrap: wrap; }')
  await page.getByRole('button', { name: 'Comprobar taller', exact: true }).click()
  await expect(page.locator('.design-check [role="status"]')).toContainText('Aún queda')
  await page.getByRole('radio', { name: 'La distribución en el eje principal' }).check()
  await page.getByRole('button', { name: 'Comprobar taller', exact: true }).click()
  await expect(page.locator('.design-check [role="status"]')).toContainText('+100 XP')
  await page.getByRole('button', { name: 'Comprobar taller', exact: true }).click()
  await expect(page.locator('.design-check [role="status"]')).toContainText('una sola vez')
  await page.reload()
  await expect(editor).toContainText('flex-wrap: wrap')
  await expect(
    page.getByRole('radio', { name: 'La distribución en el eje principal' }),
  ).toBeChecked()
  await page.getByRole('button', { name: 'Abrir en el Laboratorio', exact: true }).click()
  await expect(page).toHaveURL(/laboratorio#lab=/)
  await page.getByRole('textbox', { name: 'CSS del ejercicio' }).press('Control+End')
  await expect(page.getByRole('textbox', { name: 'CSS del ejercicio' })).toContainText(
    'flex-wrap: wrap',
  )
  await page.goto('/insignias')
  await page.getByRole('combobox', { name: 'Familia', exact: true }).selectOption('Diseño CSS')
  await expect(page.locator('.achievement-card')).toHaveCount(3)
  await expect(page.locator('.achievement-card.unlocked')).toContainText(['Del selector al diseño'])
  await page.goto('/progreso')
  await expect(page.locator('.stat-number').first()).toHaveText('110')
  await page.goto('/diseno/grid')
  await expect(page.getByRole('textbox', { name: 'CSS del taller' })).not.toContainText(
    'flex-wrap: wrap',
  )
})

test('responsive and fluid workshop previews really change with the selected iframe width', async ({
  page,
}) => {
  await page.goto('/diseno/responsive')
  await page.getByRole('button', { name: 'Ver ayuda y solución' }).click()
  await page.getByRole('button', { name: 'Cargar solución CSS' }).click()
  const preview = page.frameLocator('iframe[title^="Vista previa del taller"]')
  await expect(preview.locator('.pagina')).toHaveCSS('grid-template-columns', /^\d+(?:\.\d+)?px$/)
  await page.getByRole('button', { name: '1200', exact: true }).click()
  await expect(preview.locator('.pagina')).toHaveCSS(
    'grid-template-columns',
    /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
  )
  await page.goto('/diseno/clamp')
  await page.getByRole('button', { name: 'Ver ayuda y solución' }).click()
  await page.getByRole('button', { name: 'Cargar solución CSS' }).click()
  const title = page.frameLocator('iframe[title^="Vista previa del taller"]').locator('.titular')
  await page.getByRole('button', { name: '375', exact: true }).click()
  await expect(title).toHaveCSS('font-size', '27.25px')
  await page.getByRole('button', { name: '1200', exact: true }).click()
  await expect(title).toHaveCSS('font-size', '48px')
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', '')
})

test('design workshops are reachable from the mobile menu and accessible in both themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Menú responsive' })
    .getByRole('link', { name: 'Talleres', exact: true })
    .click()
  await expect(page).toHaveURL(/\/talleres$/)
  await page.goto('/diseno/proyecto')
  for (const label of ['Sistema', 'Claro']) {
    await page.getByRole('button', { name: `Cambiar tema. Tema actual: ${label}` }).click()
    expect((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations).toEqual([])
  }
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true)
  await page.getByRole('button', { name: 'Tu recorrido', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Pasos del taller' })).toBeHidden()
})
