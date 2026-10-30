import { expect, test } from '@playwright/test'

test('guided steps persist, resume, validate separately and keep completed workshops compatible', async ({
  page,
}) => {
  await page.goto('/talleres/flexbox')
  await page.getByRole('button', { name: 'He leído el objetivo' }).click()
  await expect(
    page.getByRole('progressbar', { name: 'Progreso del taller', exact: true }),
  ).toHaveAttribute('value', '1')
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await page.getByRole('button', { name: 'Comprobar este paso' }).click()
  await expect(page.locator('.workshop-step-status')).toContainText('Todavía falta')
  await page
    .getByRole('textbox', { name: 'CSS del taller', exact: true })
    .fill('.tarjetas { display: flex; }')
  await page.getByRole('button', { name: 'Comprobar este paso' }).click()
  await expect(page.locator('.workshop-step-status')).toContainText('Paso realizado')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Aplica flex-wrap', exact: true })).toBeVisible()
  await expect(
    page.getByRole('progressbar', { name: 'Progreso del taller', exact: true }),
  ).toHaveAttribute('value', '2')
  await page.getByRole('link', { name: '← Todos los talleres' }).click()
  const card = page.locator('.workshop-card').filter({ hasText: 'Una página con Flexbox' })
  await expect(card).toContainText('2/5 pasos')
  await expect(card).toContainText('40%')
  await page.getByRole('combobox', { name: 'Tu avance' }).selectOption('started')
  await expect(page.locator('.workshop-card')).toHaveCount(1)
  await card.getByRole('link', { name: 'Continuar taller' }).click()
  await page.getByRole('button', { name: /Comprueba distintos tamaños Por hacer/ }).click()
  await page.getByRole('button', { name: 'He revisado ambas vistas' }).click()
  await expect(page.locator('.workshop-step-status')).toContainText('Prueba primero')
  await page.getByRole('button', { name: '1200', exact: true }).click()
  await page.getByRole('button', { name: 'He revisado ambas vistas' }).click()
  await page
    .getByRole('textbox', { name: 'CSS del taller', exact: true })
    .fill('.tarjetas { display: flex; flex-wrap: wrap; }')
  await page.getByRole('radio', { name: 'La distribución en el eje principal' }).check()
  await page.getByRole('button', { name: 'Comprobar taller', exact: true }).click()
  await expect(page.locator('.workshop-success')).toBeVisible()
  await expect(
    page.getByRole('progressbar', { name: 'Progreso del taller', exact: true }),
  ).toHaveAttribute('value', '5')
  await page.getByRole('link', { name: '← Todos los talleres' }).click()
  await expect(card).toContainText('100%')
  // Existing completed data has no step history. It must still display as complete.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('csslab:v1')!)
    delete state.progress.workshops.flexbox.steps
    localStorage.setItem('csslab:v1', JSON.stringify(state))
  })
  await page.reload()
  await expect(card).toContainText('100%')
})

test('workbench stacks HTML over CSS, keeps the preview beside it and inspects DOM nodes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 })
  await page.goto('/talleres/tablas')
  await expect(page.getByRole('textbox', { name: 'HTML del taller', exact: true })).toHaveAttribute(
    'aria-readonly',
    'true',
  )
  const html = await page.locator('#workshop-html').boundingBox()
  const css = await page.locator('.workshop-code-stack > section').nth(1).boundingBox()
  const preview = await page.locator('.design-preview-panel').boundingBox()
  expect(html!.y).toBeLessThan(css!.y)
  expect(preview!.x).toBeGreaterThan(html!.x + html!.width)
  const node = page
    .locator('.workshop-dom')
    .getByRole('button', { name: '<table class="notas">', exact: true })
  await node.click()
  await expect(node).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.workshop-selected')).toHaveText('Seleccionado: table.notas')
  const frame = page.frameLocator('iframe[title^="Vista previa del taller:"]')
  await expect(frame.locator('table')).toHaveAttribute('data-csslab-inspect', '')
  await page.getByRole('button', { name: 'Quitar selección' }).click()
  await expect(frame.locator('table')).not.toHaveAttribute('data-csslab-inspect')
  await page.getByRole('button', { name: '768', exact: true }).click()
  await expect(frame.locator('html')).toHaveJSProperty('clientWidth', 768)
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', '')
  await page.getByRole('button', { name: 'Árbol DOM', exact: true }).click()
  await expect(page.locator('#workshop-dom-tree')).toBeHidden()
})
