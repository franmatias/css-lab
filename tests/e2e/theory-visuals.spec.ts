import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('box diagram and calculator distinguish the declared width from the content and outer width', async ({
  page,
}) => {
  await page.goto('/teoria/m17')
  const visual = page.getByRole('region', { name: 'Las cuatro capas de una caja', exact: true })
  await expect(visual.getByRole('img')).toHaveJSProperty('naturalWidth', 640)
  const box = page.locator('.theory-box-example')
  await expect(box).toHaveCSS('box-sizing', 'content-box')
  expect(await box.evaluate((el) => el.getBoundingClientRect().width)).toBe(248)
  await page.getByRole('combobox', { name: 'Modelo de medida' }).selectOption('border-box')
  await expect(box).toHaveCSS('box-sizing', 'border-box')
  expect(await box.evaluate((el) => el.getBoundingClientRect().width)).toBe(200)
  await expect(visual.getByRole('status')).toContainText('Contenido: 152 px')
  await page.getByRole('slider', { name: /Padding:/ }).fill('32')
  await expect(visual.getByRole('status')).toContainText('Contenido: 128 px')
  const image = await page.request.get('/illustrations/theory/box-model.svg')
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toContain('image/svg+xml')
})

test('responsive demonstration uses actual media breakpoints, plays only on request and can pause', async ({
  page,
}) => {
  await page.goto('/teoria/m16')
  const visual = page.locator('.theory-visual')
  const frame = visual.locator('iframe')
  const cards = page
    .frameLocator('iframe[title="Demostración animada de diseño responsive"]')
    .locator('.demo-cards')
  const slider = page.getByRole('slider', { name: /Ancho de la demostración/ })
  for (const [width, columns] of [
    [599, 1],
    [600, 2],
    [899, 2],
    [900, 3],
  ]) {
    await slider.fill(String(width))
    await expect(frame).toHaveJSProperty('clientWidth', width)
    await expect
      .poll(async () =>
        cards.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length),
      )
      .toBe(columns)
  }
  await expect(frame).toHaveAttribute('sandbox', '')
  await page.getByRole('button', { name: 'Reproducir recorrido', exact: true }).click()
  await expect.poll(() => slider.inputValue()).not.toBe('1024')
  await page.getByRole('button', { name: 'Pausar recorrido', exact: true }).click()
  await expect(visual.getByRole('status')).toContainText('en pausa')
  await page.getByRole('button', { name: '375 px', exact: true }).click()
  await expect(frame).toHaveJSProperty('clientWidth', 375)
  await expect(visual.locator('.theory-visual-result')).toContainText('1 columna')
})

test('motion examples support timing curves and pause, and reduced motion prevents playback', async ({
  page,
}) => {
  await page.goto('/teoria/m23')
  await page.getByRole('combobox', { name: 'Curva de ritmo' }).selectOption('steps(4, end)')
  await page.getByRole('button', { name: 'Reproducir animación', exact: true }).click()
  const rider = page.locator('.theory-motion-rider')
  await expect(rider).toHaveCSS('animation-timing-function', 'steps(4)')
  await page.getByRole('button', { name: 'Pausar animación', exact: true }).click()
  await expect(rider).toHaveCSS('animation-play-state', 'paused')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(
    page.getByRole('button', { name: 'Continuar animación', exact: true }),
  ).toBeDisabled()
  await expect(rider).toHaveCSS('animation-name', 'none')
  await page.goto('/teoria/m16')
  await expect(
    page.getByRole('button', { name: 'Reproducir recorrido', exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: '768 px', exact: true }).click()
  await expect(page.locator('.theory-visual-result')).toContainText('2 columnas')
})

test('visual explanations have text alternatives, accessible controls and mobile reflow in both themes', async ({
  page,
}) => {
  test.setTimeout(90_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  for (const path of ['/teoria/m17', '/teoria/m16', '/teoria/m23']) {
    await page.goto(path)
    const visual = page.locator('.theory-visual')
    await expect(visual.getByRole('img').first()).toHaveAttribute('alt', /.+/)
    for (const theme of ['light', 'dark']) {
      for (
        let n = 0;
        n < 3 && (await page.locator('html').getAttribute('data-theme')) !== theme;
        n++
      )
        await page.getByRole('button', { name: /Cambiar tema/ }).click()
      const audit = await new AxeBuilder({ page })
        .include('.theory-visual')
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(
        audit.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
  }
})
