import { expect, test } from '@playwright/test'

test('DOM clicks toggle a fixed selection, show its selector and preserve the sandbox', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 })
  await page.goto('/laboratorio')
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
    .fill(
      '<main class="demo"><aside class="sidebar"><h2>Enlaces rápidos</h2><a href="#">Matrícula</a></aside></main>',
    )
  const node = page
    .locator('.lab-dom-tree')
    .getByRole('button', { name: '<aside class="sidebar">', exact: true })
  await node.click()
  await expect(node).toHaveAttribute('aria-pressed', 'true')
  await page.mouse.move(40, 100)
  const preview = page.frameLocator('#panel-preview iframe')
  await expect(preview.locator('[data-csslab-inspection-caption]')).toHaveText('aside.sidebar')
  await expect(preview.locator('.sidebar')).toHaveCSS('outline-color', 'rgb(245, 158, 11)')
  await expect(page.locator('#panel-preview .lab-dom-tree')).toBeVisible()
  await node.click()
  await expect(node).toHaveAttribute('aria-pressed', 'false')
  await expect(preview.locator('.sidebar')).not.toHaveAttribute('data-csslab-inspect')
  await node.click()
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
    .fill('<p>Otra estructura</p>')
  await expect(page.locator('.lab-inspected-selector')).toContainText('Ningún elemento')
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
    .fill('<ul><li class="item a:b">Uno</li><li class="item a:b">Dos</li></ul>')
  await page
    .locator('.lab-dom-tree')
    .getByRole('button', { name: '<li class="item a:b">', exact: true })
    .nth(1)
    .click()
  const exactSelector = await page.locator('.lab-inspected-selector code').textContent()
  await expect(preview.locator(exactSelector!)).toHaveCount(1)
  await expect(preview.locator(exactSelector!)).toHaveText('Dos')
  await expect(page.locator('#panel-preview iframe')).toHaveAttribute('sandbox', '')
})

test('dark preview adapts explicit light surfaces without changing the source', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
    .fill('<main class="demo"><aside class="sidebar">Texto y enlaces</aside></main>')
  const css = page.getByRole('textbox', { name: 'CSS del ejercicio', exact: true })
  await css.fill('body, .demo, .sidebar { background: #fff; color: #111; }')
  await page.getByText('Vista y ayudas visuales', { exact: true }).click()
  await page.getByRole('combobox', { name: 'Fondo de la vista', exact: true }).selectOption('dark')
  const preview = page.frameLocator('#panel-preview iframe')
  await expect(preview.locator('body')).toHaveCSS('background-color', 'rgb(17, 24, 39)')
  await expect(preview.locator('.sidebar')).toHaveCSS('background-color', 'rgb(31, 41, 55)')
  await expect(preview.locator('.sidebar')).toHaveCSS('color', 'rgb(229, 231, 235)')
  await expect(css).toContainText('background: #fff')
  await page.getByRole('combobox', { name: 'Fondo de la vista', exact: true }).selectOption('light')
  await expect(preview.locator('.sidebar')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
})

test('the games catalogue ends in Galaxy and all guided games place HTML above the answer beside the preview', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 })
  await page.goto('/juego')
  await expect(page.getByRole('heading', { level: 1, name: 'Juegos', exact: true })).toBeVisible()
  await expect(page.locator('.game-catalog-card')).toHaveCount(6)
  await expect(page.locator('.game-catalog-card').last()).toContainText('Galaxia de selectores')
  for (const mode of ['semantica', 'flexbox', 'grid', 'responsive', 'tablas']) {
    await page.goto(`/juego/${mode}`)
    const source = page.locator('.game-code-panel')
    const answer = page.locator('.game-code-column form')
    const preview = page.locator('.game-preview-column')
    await expect(source).toBeVisible()
    const a = await source.boundingBox(),
      b = await answer.boundingBox(),
      c = await preview.boundingBox()
    expect(a!.y).toBeLessThan(b!.y)
    expect(c!.x).toBeGreaterThan(a!.x + a!.width)
    await expect(page.locator('.game-modes a').last()).toHaveText('Galaxia · 12 misiones')
  }
  await page.goto('/juego/galaxia')
  await expect(page.locator('.galaxy-board')).toBeVisible()
  await expect(page.locator('.game-workbench')).toHaveCount(0)
})
