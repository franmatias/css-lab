import { expect, test } from '@playwright/test'

test('all content reference solutions and alternatives pass in the actual browser', async ({
  page,
}) => {
  await page.goto('/retos')
  const failures = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/index.ts'
    const domainPath = '/src/domain/challenges.ts'
    const content = await import(/* @vite-ignore */ contentPath)
    const domain = await import(/* @vite-ignore */ domainPath)
    const failures: string[] = []
    for (const challenge of content.challenges) {
      const document = new DOMParser().parseFromString(challenge.html, 'text/html')
      for (const solution of [challenge.solution, ...challenge.alternatives]) {
        const result = domain.evaluateChallenge(challenge, solution, document)
        if (!result.correct) failures.push(`${challenge.id}: ${result.message}`)
      }
    }
    return failures
  })
  expect(failures).toEqual([])
})

test('a challenge awards XP once, unlocks the next and persists on reload', async ({ page }) => {
  await page.goto('/retos/m1-universal-01')
  await page.getByRole('textbox', { name: 'Tu selector' }).fill('*')
  await page.getByRole('button', { name: 'Comprobar solución' }).click()
  await expect(page.getByText('✓ Completado · 70 XP · 1 intentos')).toBeVisible()
  await page.getByRole('button', { name: 'Comprobar solución' }).click()
  await page.getByRole('link', { name: 'Siguiente reto' }).click()
  await expect(page).toHaveURL(/m1-tipo-02/)
  await page.goto('/progreso')
  await expect(page.locator('.stat-number').first()).toHaveText('80')
  await page.reload()
  await expect(page.locator('.stat-number').first()).toHaveText('80')
  await expect(page.locator('.badge-card.earned')).toContainText(['Primer selector'])
})

test('theory quiz, catalogue search and favourites work together', async ({ page }) => {
  await page.goto('/teoria/m0')
  await page
    .getByRole('radio', { name: 'El árbol de elementos del documento.', exact: true })
    .check()
  await page.getByRole('radio', { name: 'La regla no se aplica a ningún elemento.' }).check()
  await page.getByRole('button', { name: 'Comprobar respuestas' }).click()
  await page.getByRole('button', { name: 'Completar lección' }).click()
  await expect(page.getByRole('button', { name: 'Lección completada' })).toBeDisabled()
  await page.goto('/catalogo')
  await page.getByRole('searchbox', { name: 'Buscar una ficha' }).fill(':has')
  await expect(page.locator('.catalog-grid article')).toHaveCount(1)
  await page.getByRole('button', { name: /Favorito:/ }).click()
  await page.getByRole('checkbox', { name: 'Solo favoritos' }).check()
  await page.reload()
  await page.getByRole('checkbox', { name: 'Solo favoritos' }).check()
  await expect(page.locator('.catalog-grid article')).toHaveCount(1)
})

test('progress JSON roundtrip rejects malformed imports and reset requires confirmation', async ({
  page,
}) => {
  await page.goto('/retos/m1-universal-01')
  await page.getByRole('textbox', { name: 'Tu selector' }).fill('*')
  await page.getByRole('button', { name: 'Comprobar solución' }).click()
  await page.goto('/progreso')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar progreso JSON' }).click()
  const download = await downloadPromise
  const path = await download.path()
  await page.getByRole('button', { name: 'Reiniciar progreso', exact: true }).click()
  await page.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.locator('.stat-number').first()).toHaveText('80')
  await page.getByRole('button', { name: 'Reiniciar progreso', exact: true }).click()
  await page.getByRole('button', { name: 'Sí, borrar progreso' }).click()
  await expect(page.locator('.stat-number').first()).toHaveText('0')
  await page.getByLabel('Importar progreso JSON').setInputFiles(path!)
  await expect(page.locator('.stat-number').first()).toHaveText('80')
  await page
    .getByLabel('Importar progreso JSON')
    .setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"xp":-10}'),
    })
  await expect(
    page.getByText('El archivo no tiene un progreso válido. Se conservan tus datos.'),
  ).toBeVisible()
  await expect(page.locator('.stat-number').first()).toHaveText('80')
})

test('narrow learning pages reflow without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  for (const route of ['/teoria/m1', '/catalogo', '/retos/m1-universal-01', '/progreso']) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      route,
    ).toBe(true)
  }
})
