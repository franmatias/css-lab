import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('every new game solution passes in the browser and absent CSS does not win', async ({
  page,
}) => {
  await page.goto('/juego/flexbox')
  const failures = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/studioGames.ts',
      domainPath = '/src/domain/studioGame.ts'
    const { studioMissions } = await import(/* @vite-ignore */ contentPath)
    const { checkStudioGame } = await import(/* @vite-ignore */ domainPath)
    const failures: string[] = []
    for (const mission of studioMissions) {
      if (!checkStudioGame(mission, mission.solution).correct) failures.push(mission.id)
      if (checkStudioGame(mission, '').correct) failures.push(`${mission.id}: empty`)
      if (mission.mode !== 'semantica' && checkStudioGame(mission, '/* pendiente */').correct)
        failures.push(`${mission.id}: comment`)
    }
    return failures
  })
  expect(failures).toEqual([])
})

test('semantic games select real page regions, celebrate their medal and preserve points on replay', async ({
  page,
}) => {
  await page.goto('/juego/semantica')
  await page.getByRole('textbox', { name: 'Tu selector de la página' }).fill('body > header')
  await expect(
    page.frameLocator('iframe[title="Resultado de tu código"]').locator('[data-csslab-match]'),
  ).toHaveCount(1)
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('+100 XP')
  await expect(page.locator('.badge-celebration')).toContainText('Arquitecto del HTML')
  await expect(page.locator('.badge-celebration [data-badge-art="semantica-inicio"]')).toBeVisible()
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('una sola vez')
  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Tu selector de la página' })).toHaveValue(
    'body > header',
  )
  await page.goto('/progreso')
  await expect(page.locator('.progress-xp .stat-number')).toHaveText('110')
  await expect(page.locator('.journey-semantica')).toContainText('1 de 6 completadas')
  await expect(page.locator('.badge-card.earned')).toContainText(['Arquitecto del HTML'])
})

test('Flexbox and Grid puzzles render the written CSS and format without submitting the form', async ({
  page,
}) => {
  await page.goto('/juego/flexbox')
  const editor = page.getByRole('textbox', { name: 'Tu CSS para la misión', exact: true })
  await editor.fill('.pista{display:flex}')
  await page.getByRole('button', { name: 'Formatear CSS', exact: true }).click()
  await expect(editor).toContainText('display: flex')
  await expect(page.locator('.studio-feedback')).toHaveText('')
  const preview = page.frameLocator('iframe[title="Resultado de tu código"]')
  await expect(preview.locator('.pista')).toHaveCSS('display', 'flex')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('+100 XP')
  await page.goto('/juego/grid')
  await editor.fill('.pista { display: grid; grid-template-columns: repeat(3, 1fr); }')
  await expect(preview.locator('.pista')).toHaveCSS(
    'grid-template-columns',
    /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
  )
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('+100 XP')
})

test('responsive games keep the real viewport while scaling the preview and react to breakpoints', async ({
  page,
}) => {
  await page.goto('/juego/responsive/responsive-pagina')
  await page
    .getByRole('textbox', { name: 'Tu CSS para la misión' })
    .fill(
      '.pagina { display: grid; gap: 1rem; } @media (min-width: 48rem) { .pagina { grid-template-columns: repeat(3, 1fr); } }',
    )
  const preview = page.frameLocator('iframe[title="Resultado de tu código"]')
  await expect(preview.locator('.pagina')).toHaveCSS(
    'grid-template-columns',
    /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
  )
  await expect(preview.locator('html')).toHaveJSProperty('clientWidth', 1200)
  await page.getByRole('button', { name: '375 px', exact: true }).click()
  await expect(preview.locator('.pagina')).toHaveCSS('grid-template-columns', /^\d+(?:\.\d+)?px$/)
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('+180 XP')
  await expect(page.locator('iframe').first()).toHaveAttribute('sandbox', '')
})

test('medals have large individual artwork, unique SVG ids and an accessible enlarged view', async ({
  page,
}) => {
  await page.goto('/insignias')
  await expect(page.locator('.achievement-card')).toHaveCount(50)
  expect(
    await page
      .locator('.achievement-card .badge-medal-art')
      .first()
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeGreaterThanOrEqual(180)
  const ids = await page.locator('svg defs [id]').evaluateAll((els) => els.map((el) => el.id))
  expect(new Set(ids).size).toBe(ids.length)
  const button = page.locator('.achievement-card').first().getByRole('button')
  await button.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Primer selector', exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(button).toBeFocused()
  await page.getByRole('combobox', { name: 'Familia', exact: true }).selectOption('Flexbox')
  await expect(page.locator('.achievement-card')).toHaveCount(2)
  await page.getByRole('combobox', { name: 'Ordenar', exact: true }).selectOption('near')
  await expect(page.locator('.achievement-card')).toHaveCount(2)
})

for (const path of [
  '/insignias',
  '/progreso',
  '/juego/semantica',
  '/juego/flexbox',
  '/juego/grid',
  '/juego/responsive',
]) {
  test(`${path} has no automated accessibility issues in both themes and fits mobile`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const label of ['Sistema', 'Claro']) {
      await page.getByRole('button', { name: `Cambiar tema. Tema actual: ${label}` }).click()
      await expect(page.locator('body')).toHaveCSS(
        'color',
        label === 'Sistema' ? 'rgb(26, 27, 46)' : 'rgb(236, 237, 247)',
      )
      const violations = (await new AxeBuilder({ page }).exclude('iframe').analyze()).violations
      expect(violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))).toEqual(
        [],
      )
    }
    await page.setViewportSize({ width: 320, height: 900 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true)
  })
}
