import { expect, test } from '@playwright/test'

test('autocomplete text and selection keep at least 4.5 to 1 contrast in both themes', async ({
  page,
}) => {
  await page.goto('/talleres/grid')
  const editor = page.getByRole('textbox', { name: 'CSS del taller', exact: true })
  for (const theme of ['Sistema', 'Claro']) {
    await page.getByRole('button', { name: `Cambiar tema. Tema actual: ${theme}` }).click()
    await editor.fill('.tarjeta {\n col')
    await editor.press('Control+Space')
    const popup = page.locator('.cm-tooltip-autocomplete')
    await expect(popup).toBeVisible()
    const ratios = await popup.evaluate((element) => {
      const luminance = (color: string) => {
        const channels = (color.match(/[\d.]+/g) ?? [])
          .slice(0, 3)
          .map(Number)
          .map((n) => n / 255)
          .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
        return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
      }
      return Array.from(element.querySelectorAll('li'))
        .slice(0, 4)
        .map((item) => {
          let background: Element | null = item
          while (
            background &&
            ['rgba(0, 0, 0, 0)', 'transparent'].includes(
              getComputedStyle(background).backgroundColor,
            )
          )
            background = background.parentElement
          const a = luminance(getComputedStyle(item).color)
          const b = luminance(getComputedStyle(background ?? element).backgroundColor)
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        })
    })
    expect(ratios.length).toBeGreaterThan(1)
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5)
    await expect(popup.locator('[aria-selected="true"]')).toBeVisible()
    await editor.press('Escape')
  }
})

test('syntax has distinct colours and line numbers stay aligned after font changes', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  await expect(page.locator('#panel-html .cm-line')).toHaveCount(5)
  const colors = await page
    .locator('#panel-css .cm-line span')
    .evaluateAll((nodes) => [...new Set(nodes.map((node) => getComputedStyle(node).color))])
  expect(colors.length).toBeGreaterThanOrEqual(3)
  async function alignment() {
    return page.locator('#panel-html .cm-editor').evaluate(async (editor) => {
      await document.fonts.ready
      const line = editor.querySelector('.cm-line')!
      const number = Array.from(editor.querySelectorAll('.cm-lineNumbers .cm-gutterElement')).find(
        (node) =>
          node.textContent === '1' &&
          getComputedStyle(node).visibility !== 'hidden' &&
          node.getBoundingClientRect().height > 0,
      )!
      return Math.abs(line.getBoundingClientRect().top - number.getBoundingClientRect().top)
    })
  }
  await expect.poll(alignment).toBeLessThanOrEqual(1)
  await page.getByRole('button', { name: 'Opciones del editor' }).click()
  await page.getByLabel('Tamaño del código').selectOption('18')
  await expect.poll(alignment).toBeLessThanOrEqual(1)
})

test('formatting expands minified code, supports tabs and preserves malformed input', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  await page
    .getByRole('textbox', { name: 'HTML del ejercicio' })
    .fill('<section><h2>Hola</h2><p>Texto</p></section>')
  await page.getByRole('button', { name: 'Formatear HTML', exact: true }).click()
  await expect(page.locator('#panel-html .cm-line')).toHaveCount(5)
  await page.getByRole('button', { name: 'Opciones del editor' }).click()
  await page
    .getByRole('combobox', { name: 'Indentación', exact: true })
    .selectOption({ label: 'Tabulaciones' })
  await page.getByRole('button', { name: 'Formatear HTML', exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('csslab:v1')!).lab?.html ?? ''))
    .toContain('\t<h2>')
  await page.getByRole('textbox', { name: 'CSS del ejercicio' }).fill('.nota { color: red')
  await page.getByRole('button', { name: 'Formatear CSS', exact: true }).click()
  await expect(page.locator('.lab-format-message')).toContainText('tu código se conserva')
  await expect(page.getByRole('textbox', { name: 'CSS del ejercicio' })).toHaveText(
    '.nota { color: red',
  )
})

test('preview borders and fills are independent and paused edits apply explicitly', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  const preview = page.frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
  await page.getByRole('button', { name: 'Fondo', exact: true }).click()
  await expect(preview.locator('.featured')).toHaveCSS('outline-style', 'none')
  await expect(preview.locator('.featured')).toHaveCSS('background-color', 'rgba(180, 83, 9, 0.14)')
  await page.getByRole('button', { name: 'Bordes', exact: true }).click()
  await expect(preview.locator('.featured')).toHaveCSS('outline-style', 'dashed')
  await expect(preview.locator('.featured')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await page.getByRole('button', { name: 'En directo', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'CSS del ejercicio' })
    .fill('.featured { color: rgb(0, 128, 0); }')
  await expect(preview.locator('.featured')).toHaveCSS('color', 'rgb(79, 70, 229)')
  await page.getByRole('button', { name: 'Aplicar cambios' }).click()
  await expect(preview.locator('.featured')).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(preview.locator('.featured')).toHaveAttribute('data-csslab-changed', '')
  await page.getByText('Vista y ayudas visuales', { exact: true }).click()
  await page.getByRole('checkbox', { name: 'Animar los cambios' }).uncheck()
  await expect(page.locator('iframe')).not.toHaveAttribute('srcdoc', /@keyframes csslab-change/)
  await page.reload()
  await expect(page.getByRole('button', { name: 'En pausa', exact: true })).toBeVisible()
})
