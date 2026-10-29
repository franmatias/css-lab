import { expect, test } from '@playwright/test'

test('the compiled Pages app boots and opens every section under its repository prefix', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('/css-lab/')
  await expect(page.getByRole('heading', { name: /deja de memorizar/i })).toBeVisible()
  for (const name of [
    'Teoría',
    'Catálogo',
    'Laboratorio',
    'Juego visual',
    'Retos',
    'Progreso',
    'Insignias',
  ]) {
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name })
      .click()
    await expect(page.getByRole('heading', { name, level: 1, exact: true })).toBeVisible()
    if (name === 'Juego visual') {
      await page.getByRole('textbox', { name: 'Tu selector de la misión' }).fill('.rocoso')
      await page.getByRole('button', { name: 'Activar constelación' }).click()
      await expect(page.locator('.galaxy-board')).toHaveClass(/is-won/)
    }
    if (name === 'Laboratorio') {
      await page.getByRole('button', { name: 'Formatear todo' }).click()
      await expect(page.locator('.lab-format-message')).toContainText('Código formateado')
    }
    await expect(page).toHaveURL(/\/css-lab\//)
  }
  expect(errors).toEqual([])
})
