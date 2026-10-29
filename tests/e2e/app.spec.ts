import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the selector demo updates its matches and explains invalid input', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /deja de memorizar/i })).toBeVisible()

  const selector = page.getByRole('textbox', { name: 'Tu selector' })
  await selector.fill('article')
  await expect(page.getByRole('status')).toContainText('2 elementos coinciden')

  await selector.fill(':not(')
  await expect(page.getByRole('status')).toContainText('no parece válido')
})

test('navigation loads sections, focuses the heading, and remembers theme', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', { name: 'Teoría' })
    .click()
  await expect(page).toHaveURL(/\/teoria$/)
  await expect(page.getByRole('heading', { name: 'Teoría' })).toBeFocused()

  await page.goto('/')
  await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Sistema' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

for (const path of [
  '/',
  '/teoria',
  '/catalogo',
  '/laboratorio',
  '/retos',
  '/progreso',
  '/ruta-inexistente',
]) {
  test(`${path} has no automated accessibility violations in both themes`, async ({ page }) => {
    await page.goto(path)
    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Sistema' }).click()
    let results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, `${path} in light theme`).toEqual([])

    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Claro' }).click()
    results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, `${path} in dark theme`).toEqual([])
  })
}

test('mobile navigation fits a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/')

  await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeVisible()
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})
