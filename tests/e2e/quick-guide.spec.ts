import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the reference guide searches selectors and properties, preserves drafts and restores focus', async ({
  page,
}) => {
  await page.goto('/talleres/grid')
  const editor = page.getByRole('textbox', { name: 'CSS del taller', exact: true })
  await editor.fill('.galeria { display: grid; }')
  const open = page.getByRole('button', { name: 'Consultar guía rápida de CSS ↗', exact: true })
  await open.click()
  const guide = page.getByRole('dialog', { name: 'Guía rápida de CSS', exact: true })
  await expect(guide).toBeVisible()
  await expect(guide.locator('.quick-guide-count')).toHaveText('96 referencias en 16 bloques')
  await guide.getByRole('searchbox', { name: 'Buscar en la guía' }).fill('clamp')
  await expect(guide.locator('.quick-guide-count')).toHaveText('1 referencia en 1 bloque')
  await expect(guide.locator('code')).toContainText(['clamp('])
  await guide.getByRole('searchbox', { name: 'Buscar en la guía' }).fill('buho')
  await expect(guide).toContainText('Selector búho')
  await guide.getByRole('searchbox', { name: 'Buscar en la guía' }).fill('')
  await guide.getByRole('combobox', { name: 'Tema de referencia' }).selectOption('Selectores')
  await expect(guide.locator('.quick-guide-card')).toHaveCount(6)
  await page.keyboard.press('Escape')
  await expect(guide).toHaveCount(0)
  await expect(open).toBeFocused()
  await expect(editor).toContainText('display: grid')
})

test('the guide is accessible in both themes and opens from the narrow mobile menu', async ({
  page,
}) => {
  await page.goto('/')
  for (const theme of ['Sistema', 'Claro']) {
    await page.getByRole('button', { name: `Cambiar tema. Tema actual: ${theme}` }).click()
    await page.getByRole('button', { name: 'Abrir guía rápida de CSS', exact: true }).click()
    const guide = page.getByRole('dialog', { name: 'Guía rápida de CSS', exact: true })
    await expect(guide).toBeVisible()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await guide.getByRole('button', { name: 'Cerrar guía rápida' }).click()
  }
  await page.setViewportSize({ width: 320, height: 900 })
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Menú responsive' })
    .getByRole('button', { name: 'Guía rápida de CSS', exact: true })
    .click()
  const guide = page.getByRole('dialog', { name: 'Guía rápida de CSS', exact: true })
  await expect(guide).toBeVisible()
  expect(await guide.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
  await guide.getByRole('button', { name: 'Cerrar guía rápida' }).click()
  await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused()
})
