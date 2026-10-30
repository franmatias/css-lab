import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the responsive menu opens, closes with Escape and navigates on a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  const menu = page.getByRole('navigation', { name: 'Menú responsive' })
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: 'Inicio', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused()
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await menu.getByRole('link', { name: 'Juego visual', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Juego visual', exact: true, level: 1 }),
  ).toBeVisible()
  await expect(menu).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('visual missions animate success, award points once and unlock their badges', async ({
  page,
}) => {
  await page.goto('/juego/galaxia-rocosos')
  const selector = page.getByRole('textbox', { name: 'Tu selector de la misión' })
  await selector.fill('.planeta')
  await page.getByRole('button', { name: 'Activar constelación' }).click()
  await expect(page.getByRole('status')).toContainText('sobran 3 elementos')
  await selector.fill('.rocoso')
  await expect(page.locator('.galaxy-node.selected')).toHaveCount(3)
  await page.getByRole('button', { name: 'Activar constelación' }).click()
  await expect(page.locator('.galaxy-board')).toHaveClass(/is-won/)
  await expect(page.locator('.game-answer [role="status"]')).toContainText('+100 XP')
  await expect(page.getByRole('link', { name: 'Siguiente misión' })).toBeVisible()
  await page.getByRole('button', { name: 'Activar constelación' }).click()
  await expect(page.locator('.game-answer [role="status"]')).toContainText('una sola vez')
  await page.goto('/progreso')
  await expect(page.locator('.stat-number').first()).toHaveText('110')
  await page.goto('/insignias')
  await expect(page.locator('.achievement-card.unlocked')).toContainText(['Primer contacto'])
  await page.getByRole('combobox', { name: 'Familia', exact: true }).selectOption('Juego visual')
  await expect(page.locator('.achievement-card')).toHaveCount(6)
  await page.reload()
  await expect(page.locator('.achievement-overview')).toContainText('110 XP')
})

test('all visual solutions pass in Chromium and practical recipes use supported CSS', async ({
  page,
}) => {
  await page.goto('/juego')
  const errors = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/game.ts'
    const domainPath = '/src/domain/visualGame.ts'
    const recipePath = '/packages/content/src/recipes.ts'
    const { galaxyHtml, gameLevels } = await import(/* @vite-ignore */ contentPath)
    const { evaluateVisualGame } = await import(/* @vite-ignore */ domainPath)
    const { recipes } = await import(/* @vite-ignore */ recipePath)
    const errors: string[] = []
    for (const level of gameLevels)
      if (!evaluateVisualGame(galaxyHtml, level.solution, level.solution).correct)
        errors.push(level.id)
    for (const recipe of recipes) {
      if (!CSS.supports(`selector(${recipe.selector})`)) errors.push(recipe.id)
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(recipe.css)
      if (!sheet.cssRules.length) errors.push(recipe.id)
    }
    return errors
  })
  expect(errors).toEqual([])
})

test('side panels expand and collapse without losing code or progress', async ({ page }) => {
  await page.goto('/teoria')
  await page.getByRole('button', { name: 'Contraer Mapa de aprendizaje' }).click()
  await expect(page.locator('.learning-layout')).toHaveClass(/sidebar-collapsed/)
  await page.getByRole('button', { name: 'Extender Mapa de aprendizaje' }).click()
  await expect(page.locator('.learning-layout')).not.toHaveClass(/sidebar-collapsed/)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/laboratorio')
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio' })
    .fill('<p class="saved">Conservado</p>')
  await page.getByRole('button', { name: 'Contraer Estructura', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'HTML del ejercicio' })).toBeHidden()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Extender Estructura', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Extender Estructura', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'HTML del ejercicio' })).toHaveText(
    '<p class="saved">Conservado</p>',
  )
  await page.getByRole('button', { name: 'Contraer Árbol del documento', exact: true }).click()
  await expect(page.locator('#lab-tree-content')).toBeHidden()
  await page.getByRole('button', { name: 'Extender Árbol del documento', exact: true }).click()
  await expect(page.locator('#lab-tree-content')).toBeVisible()
})

test('the owl recipe creates spacing and the checked-card recipe reacts without scripts', async ({
  page,
}) => {
  await page.goto('/ejemplos/selector-buho')
  const owl = page.frameLocator('.recipe-preview')
  await expect(owl.locator('.flujo > h2')).toHaveCSS('margin-top', '0px')
  await expect(owl.locator('.flujo > p').first()).toHaveCSS('margin-top', '16px')
  await page.getByRole('button', { name: 'Abrir en el Laboratorio', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'CSS del ejercicio' })).toContainText(
    'margin-block-start',
  )
  await page.goto('/ejemplos/tarjeta-seleccionada')
  const card = page.frameLocator('.recipe-preview')
  await card.getByRole('checkbox').check()
  await expect(card.locator('.tarjeta')).toHaveCSS('background-color', 'rgb(238, 242, 255)')
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', '')
})

for (const path of ['/juego', '/insignias', '/ejemplos', '/ejemplos/selector-buho']) {
  test(`${path} is accessible in both themes and fits mobile`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Sistema' }).click()
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(26, 27, 46)')
    expect((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations).toEqual([])
    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Claro' }).click()
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(236, 237, 247)')
    expect((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations).toEqual([])
    await page.setViewportSize({ width: 320, height: 800 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
