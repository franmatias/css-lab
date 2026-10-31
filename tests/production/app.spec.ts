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
    'Talleres',
    'Juegos',
    'Retos',
    'Progreso',
  ]) {
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name })
      .click()
    await expect(
      page.getByRole('heading', {
        name: name === 'Talleres' ? 'Talleres CSS' : name,
        level: 1,
        exact: true,
      }),
    ).toBeVisible()
    if (name === 'Juegos') {
      await page.getByRole('link', { name: 'Galaxia de selectores', exact: true }).click()
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
  await page.getByRole('link', { name: /^Insignias obtenidas:/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Insignias', level: 1, exact: true }),
  ).toBeVisible()
  await page.goto('/css-lab/diseno/listas')
  await page.getByRole('button', { name: 'He leído el objetivo' }).click()
  await page.getByRole('button', { name: /Comprueba distintos tamaños Por hacer/ }).click()
  await page.getByRole('button', { name: '1200', exact: true }).click()
  await page.getByRole('button', { name: 'He revisado ambas vistas' }).click()
  await page.getByRole('button', { name: 'Ver ayuda y solución' }).click()
  await page.getByRole('button', { name: 'Cargar solución CSS' }).click()
  await expect(page.getByRole('textbox', { name: 'CSS del taller' })).toContainText(
    'font-weight: 700',
  )
  await page.getByRole('radio', { name: 'ol', exact: true }).check()
  await page.getByRole('button', { name: 'Comprobar taller', exact: true }).click()
  await expect(page.locator('.design-check [role="status"]')).toContainText('+100 XP')
  await page.goto('/css-lab/juego/tablas')
  await page
    .getByRole('textbox', { name: 'Tu selector para la tabla' })
    .fill('tbody > tr:nth-child(2) > td:nth-child(3)')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('+100 XP')
  await page.goto('/css-lab/juego/grid')
  await page
    .getByRole('textbox', { name: 'Tu CSS para la misión' })
    .fill('.pista { display: grid; grid-template-columns: repeat(3, 1fr); }')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.studio-feedback')).toContainText('+100 XP')
  await page.goto('/css-lab/progreso')
  await expect(page.locator('.progress-hero')).toBeVisible()
  await expect(page.locator('.journey-grid')).toContainText('1 de 6 completadas')
  await page.goto('/css-lab/teoria/m15')
  await expect(
    page.getByRole('heading', { name: 'Uso adecuado de Flexbox', level: 1, exact: true }),
  ).toBeVisible()
  await expect(
    page.frameLocator('iframe[title^="Vista de teoría:"]').locator('.tarjetas'),
  ).toHaveCSS('display', 'flex')
  expect(errors).toEqual([])
})
