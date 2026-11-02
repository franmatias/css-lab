import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const panel = (page: Page) =>
  page.getByRole('region', { name: 'Experimentos de propiedades', exact: true })
const scene = (page: Page) => page.frameLocator('iframe[title^="Experimento interactivo:"]')

test('gradients, backgrounds and typography generate the CSS that is actually rendered and preserve settings', async ({
  page,
}) => {
  await page.goto('/teoria/m18')
  const lab = panel(page)
  const picker = lab.getByRole('combobox', { name: 'Experimento de esta lección' })
  await picker.selectOption('gradient')
  await lab.getByRole('slider', { name: /Ángulo del gradiente/ }).fill('180')
  await expect(lab.getByRole('textbox', { name: /^CSS generado:/ })).toContainText('180deg')
  await expect(scene(page).locator('.muestra')).toHaveCSS('background-image', /linear-gradient/)
  await lab.getByRole('combobox', { name: 'Tipo de gradiente', exact: true }).selectOption('radial')
  await expect(scene(page).locator('.muestra')).toHaveCSS('background-image', /radial-gradient/)
  await expect(lab.getByRole('slider', { name: /Ángulo del gradiente/ })).toHaveCount(0)
  await picker.selectOption('background')
  await lab.getByRole('combobox', { name: 'Tamaño del fondo' }).selectOption('contain')
  await expect(scene(page).locator('.muestra')).toHaveCSS('background-size', 'contain')
  await expect(scene(page).locator('.muestra')).toHaveCSS(
    'background-image',
    /data:image\/svg\+xml/,
  )
  await expect(lab.getByRole('link', { name: /Descargar paisaje/ })).toHaveAttribute(
    'download',
    'paisaje.svg',
  )
  await picker.selectOption('typography')
  await lab.getByRole('slider', { name: /Tamaño de letra/ }).fill('28')
  await lab.getByRole('slider', { name: /Interlineado/ }).fill('1.8')
  await expect(scene(page).locator('.muestra')).toHaveCSS('font-size', '28px')
  await expect
    .poll(() =>
      scene(page)
        .locator('.muestra')
        .evaluate((el) => parseFloat(getComputedStyle(el).lineHeight)),
    )
    .toBeCloseTo(50.4, 3)
  await picker.selectOption('gradient')
  await lab.getByRole('combobox', { name: 'Tipo de gradiente', exact: true }).selectOption('linear')
  await expect(lab.getByRole('slider', { name: /Ángulo del gradiente/ })).toHaveValue('180')
  await lab.getByRole('button', { name: 'Restaurar experimento' }).click()
  await expect(lab.getByRole('slider', { name: /Ángulo del gradiente/ })).toHaveValue('90')
  await expect(lab.locator('iframe')).toHaveAttribute('sandbox', '')
})

test('position, transforms and shadow controls affect real geometry and computed properties', async ({
  page,
}) => {
  await page.goto('/teoria/m19')
  let lab = panel(page)
  await lab.getByRole('combobox', { name: 'Tipo de posición' }).selectOption('fixed')
  await lab.getByRole('slider', { name: /Desplazamiento vertical/ }).fill('60')
  await expect(scene(page).locator('.muestra')).toHaveCSS('position', 'fixed')
  expect(
    await scene(page)
      .locator('.muestra')
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBe(60)
  await scene(page)
    .locator('body')
    .evaluate((el) => el.ownerDocument.defaultView!.scrollTo(0, 200))
  expect(
    await scene(page)
      .locator('.muestra')
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBe(60)
  await lab.getByRole('combobox', { name: 'Tipo de posición' }).selectOption('static')
  await expect(lab.locator('.property-playground-observation')).toContainText('los ignora')
  await page.goto('/teoria/m22')
  lab = panel(page)
  const neighborTop = await scene(page)
    .locator('.vecino')
    .evaluate((el) => el.getBoundingClientRect().top)
  await lab.getByRole('slider', { name: /^Giro/ }).fill('30')
  await expect(lab.getByRole('textbox', { name: /^CSS generado:/ })).toContainText('rotate(30deg)')
  await expect(scene(page).locator('.muestra')).not.toHaveCSS('transform', 'none')
  await expect(scene(page).locator('.muestra')).toHaveCSS('position', 'static')
  await expect
    .poll(() =>
      scene(page)
        .locator('.vecino')
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBe(neighborTop)
  await page.goto('/teoria/m20')
  lab = panel(page)
  await lab.getByRole('slider', { name: /Opacidad del elemento/ }).fill('0.5')
  await expect(scene(page).locator('.muestra')).toHaveCSS('opacity', '0.5')
  await expect(scene(page).locator('.muestra')).not.toHaveCSS('box-shadow', 'none')
})

test('unit and function explanations match computed widths and the actual iframe viewport', async ({
  page,
}) => {
  await page.goto('/teoria/m10')
  const lab = panel(page)
  const picker = lab.getByRole('combobox', { name: 'Experimento de esta lección' })
  await picker.selectOption('units')
  await lab.getByRole('slider', { name: /^Cantidad/ }).fill('2')
  await lab.getByRole('combobox', { name: 'Unidad de medida' }).selectOption('rem')
  await lab.getByRole('slider', { name: /Letra de la raíz/ }).fill('20')
  await expect(scene(page).locator('.muestra')).toHaveCSS('width', '40px')
  await lab.getByRole('combobox', { name: 'Unidad de medida' }).selectOption('em')
  await lab.getByRole('slider', { name: /Letra del contenedor/ }).fill('24')
  await expect(scene(page).locator('.muestra')).toHaveCSS('width', '48px')
  await picker.selectOption('functions')
  await lab.getByRole('slider', { name: /Viewport del experimento/ }).fill('600')
  await expect(lab.locator('iframe')).toHaveJSProperty('clientWidth', 600)
  await expect(scene(page).locator('.muestra')).toHaveCSS('font-size', '24px')
  await lab.getByRole('slider', { name: /Viewport del experimento/ }).fill('1024')
  await expect(lab.locator('iframe')).toHaveJSProperty('clientWidth', 1024)
  // Compare within 0.05 CSS px: engines round fractional fluid font sizes differently.
  await expect
    .poll(() =>
      scene(page)
        .locator('.muestra')
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    )
    .toBeCloseTo(40.96, 1)
})

test('animation can pause and finish and transitions have an explicit state control with reduced motion support', async ({
  page,
}) => {
  await page.goto('/teoria/m23')
  let lab = panel(page)
  const sample = lab.locator('.property-native-sample')
  await lab.getByRole('button', { name: 'Reproducir experimento', exact: true }).click()
  await expect(sample).toHaveCSS('animation-play-state', 'running')
  await lab.getByRole('button', { name: 'Pausar experimento', exact: true }).click()
  await expect(sample).toHaveCSS('animation-play-state', 'paused')
  await lab.getByRole('slider', { name: /Duración de la animación/ }).fill('0.5')
  await lab.getByRole('button', { name: 'Reproducir experimento', exact: true }).click()
  await expect(lab.getByRole('button', { name: 'Repetir experimento', exact: true })).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(lab.getByRole('button', { name: 'Repetir experimento', exact: true })).toBeDisabled()
  await expect(sample).toHaveCSS('animation-name', 'none')
  await page.goto('/teoria/m21')
  lab = panel(page)
  await lab.getByRole('button', { name: 'Activar estado final' }).click()
  await expect(lab.locator('.property-native-sample')).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, -24)',
  )
  await expect(lab.locator('.property-native-sample')).toHaveCSS('transition-duration', '0s')
})

test('Flexbox and Grid react to controls, source is read-only and scenes can be continued in the lab', async ({
  page,
}) => {
  await page.goto('/teoria/m15')
  let lab = panel(page)
  await lab.getByRole('combobox', { name: 'Dirección de Flexbox' }).selectOption('column')
  await expect(scene(page).locator('.muestra')).toHaveCSS('flex-direction', 'column')
  await page.goto('/teoria/m16')
  lab = panel(page)
  await lab.getByRole('slider', { name: /Número de columnas/ }).fill('2')
  await lab.getByRole('slider', { name: /Columnas del primer elemento/ }).fill('4')
  await expect(scene(page).locator('.muestra > :first-child')).toHaveCSS(
    'grid-column-start',
    'span 2',
  )
  await expect(lab.getByRole('textbox', { name: /^CSS generado:/ })).toHaveAttribute(
    'aria-readonly',
    'true',
  )
  await lab.getByText('HTML de la escena y estilos de partida', { exact: true }).click()
  await expect(
    lab.getByRole('textbox', { name: 'HTML de la escena del experimento', exact: true }),
  ).toContainText('<article>')
  await lab.getByRole('button', { name: 'Experimentar libremente ↗' }).click()
  await expect(page).toHaveURL(/\/laboratorio#/)
  await expect(page.getByRole('textbox', { name: 'CSS del ejercicio', exact: true })).toContainText(
    'grid-template-columns: repeat(2',
  )
})

test('property playground controls remain accessible and reflow at 320px in both themes', async ({
  page,
}) => {
  test.setTimeout(90_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  for (const path of ['/teoria/m18', '/teoria/m19', '/teoria/m23', '/teoria/m10']) {
    await page.goto(path)
    await expect(panel(page)).toBeVisible()
    for (const theme of ['light', 'dark']) {
      for (
        let n = 0;
        n < 3 && (await page.locator('html').getAttribute('data-theme')) !== theme;
        n++
      )
        await page.getByRole('button', { name: /Cambiar tema/ }).click()
      const audit = await new AxeBuilder({ page })
        .include('.property-playground')
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
