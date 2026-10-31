import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the selector demo updates its matches and explains invalid input', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /da forma a tus ideas/i })).toBeVisible()

  const selector = page.getByRole('textbox', { name: 'Tu selector' })
  await expect(page.getByRole('status')).toContainText('1 elementos coinciden')
  await selector.fill('article')
  await expect(page.getByRole('status')).toContainText('2 elementos coinciden')

  await selector.fill(':not(')
  await expect(page.getByRole('status')).toContainText('no parece válido')
})

test('navigation loads sections, focuses the heading, and remembers theme', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 })
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

test('the isolated laboratory highlights matches and keeps a safe local draft', async ({
  page,
}) => {
  await page.goto('/laboratorio')

  const selector = page.getByRole('textbox', { name: 'Selector que quieres probar' })
  await expect(page.getByRole('status')).toContainText('1 elementos coinciden')
  await expect(page.getByText('0, 1, 0')).toBeVisible()

  await selector.fill('p')
  await expect(page.getByRole('status')).toContainText('1 elementos coinciden')

  const preview = page.frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
  await expect(preview.locator('[data-csslab-match]')).toContainText('Prueba un selector')
  await expect(preview.locator('script')).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', '')

  await selector.fill('main:has(.featured)')
  await expect(page.getByRole('status')).toContainText('1 elementos coinciden')
  await expect(page.getByText('0, 1, 1')).toBeVisible()

  await page
    .getByRole('textbox', { name: 'CSS del ejercicio' })
    .fill('body::before { content: "</style><script>window.pwned=1</script>"; }')
  await expect(preview.locator('script')).toHaveCount(0)

  await page
    .getByRole('textbox', { name: 'HTML del ejercicio' })
    .fill(
      '<article><p id="saved">Guardado</p><script>window.pwned = true</script><img src=x onerror="alert(1)"></article>',
    )
  await page.getByRole('textbox', { name: 'Selector que quieres probar' }).fill('#saved')
  await expect(page.getByRole('status')).toContainText('1 elementos coinciden')
  await expect(page.getByText('1, 0, 0')).toBeVisible()
  await page.waitForTimeout(300)
  await page.reload()

  await expect(page.getByRole('textbox', { name: 'HTML del ejercicio' })).toHaveText(
    '<article><p id="saved">Guardado</p><script>window.pwned = true</script><img src=x onerror="alert(1)"></article>',
  )
  const safePreview = page.frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
  await expect(safePreview.locator('script')).toHaveCount(0)
  await expect(safePreview.locator('img')).not.toHaveAttribute('onerror', /.+/)

  await expect(page.getByText('Árbol del documento')).toBeVisible()
  await expect(page.locator('.lab-dom-tree-match')).toContainText('Coincide')
  await expect(page.locator('.lab-dom-tree-match')).toContainText('id="saved"')
  await page.getByRole('button', { name: 'Compartir solución' }).click()
  const shareUrl = page.getByRole('textbox', { name: 'Enlace para compartir' })
  await expect(shareUrl).toBeVisible()
  await expect(page).toHaveURL(/#lab=/)
  const sharedUrl = await shareUrl.inputValue()

  await page
    .getByRole('textbox', { name: 'HTML del ejercicio' })
    .fill('<p id="local-only">Borrador local</p>')
  await page.waitForTimeout(300)
  const sharedPage = await page.context().newPage()
  await sharedPage.goto(sharedUrl)
  await expect(sharedPage.locator('.lab-share-result [role="status"]')).toContainText(
    'Borrador cargado desde el enlace compartido',
  )
  await expect(sharedPage.getByRole('textbox', { name: 'HTML del ejercicio' })).toHaveText(
    '<article><p id="saved">Guardado</p><script>window.pwned = true</script><img src=x onerror="alert(1)"></article>',
  )
  await sharedPage.getByRole('button', { name: 'Restablecer ejemplo' }).click()
  await expect(sharedPage).toHaveURL(/\/laboratorio$/)
  await expect(sharedPage.getByRole('textbox', { name: 'HTML del ejercicio' })).toContainText(
    'Aprende seleccionando',
  )
  await sharedPage.close()
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
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Sistema' }).click()
    let results = await new AxeBuilder({ page }).exclude('iframe').analyze()
    expect(results.violations, `${path} in light theme`).toEqual([])

    await page.getByRole('button', { name: 'Cambiar tema. Tema actual: Claro' }).click()
    results = await new AxeBuilder({ page }).exclude('iframe').analyze()
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

test('laboratory panels switch accessibly on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('/laboratorio')

  const cssTab = page.getByRole('tab', { name: 'Estilos' })
  await cssTab.click()
  await expect(cssTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Estilos' })).toBeVisible()

  await page.getByRole('tab', { name: 'Vista previa' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Vista previa' })).toBeVisible()
})
