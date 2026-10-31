import { expect, test } from '@playwright/test'

test('HTML expands with Tab, supports numbering and fields, and renders real elements', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  const editor = page.getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
  await editor.fill('')
  await editor.pressSequentially('ul>li.item$*3')
  await editor.press('Tab')
  await expect(editor).toContainText('<li class="item1">')
  await expect(editor).toContainText('<li class="item3">')
  const preview = page.frameLocator('iframe[title="Vista previa aislada del ejercicio"]')
  await expect(preview.locator('ul > li')).toHaveCount(3)
  await editor.fill('')
  await editor.pressSequentially('a')
  await editor.press('Tab')
  await expect(editor).toContainText('<a href="">')
  await editor.pressSequentially('#inicio')
  await editor.press('Tab')
  await editor.pressSequentially('Inicio')
  await expect(editor).toContainText('<a href="#inicio">Inicio</a>')
  await expect(preview.getByRole('link', { name: 'Inicio', exact: true })).toHaveAttribute(
    'href',
    '#inicio',
  )
})

test('CSS expands with shortcut and button, and Tab still indents outside abbreviations', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  const editor = page.getByRole('textbox', { name: 'CSS del ejercicio', exact: true })
  await editor.fill('.muestra {\n  m24\n}')
  await editor.press('ControlOrMeta+End')
  await editor.press('ArrowUp')
  await editor.press('End')
  await editor.press('ControlOrMeta+Shift+e')
  await expect(editor).toContainText('margin: 24px;')
  await editor.fill('.muestra {\n  p16\n}')
  await editor.press('ControlOrMeta+End')
  await editor.press('ArrowUp')
  await editor.press('End')
  await page.getByRole('button', { name: 'Expandir abreviatura Emmet en CSS', exact: true }).click()
  await expect(editor).toContainText('padding: 16px;')
  await editor.press('ControlOrMeta+End')
  await editor.press('Enter')
  await editor.press('Tab')
  await expect.poll(() => editor.locator('.cm-line').last().textContent()).toMatch(/^\s+$/)
  await editor.fill('.muestra {\n  ')
  await editor.pressSequentially('df')
  await editor.press('Tab')
  await expect(editor).toContainText('display: flex;')
})

test('Emmet follows indentation settings, handles invalid input and keeps size limits', async ({
  page,
}) => {
  await page.goto('/laboratorio')
  const editor = page.getByRole('textbox', { name: 'HTML del ejercicio', exact: true })
  await page.getByRole('button', { name: 'Opciones del editor', exact: true }).click()
  await page
    .getByRole('combobox', { name: 'Indentación', exact: true })
    .selectOption({ label: 'Tabulaciones' })
  await editor.fill('ul>li*2')
  await editor.press('ControlOrMeta+End')
  await page
    .getByRole('button', { name: 'Expandir abreviatura Emmet en HTML', exact: true })
    .click()
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('csslab:v1')!).lab?.html ?? ''))
    .toContain('\t<li>')
  await editor.fill('div>+p')
  await editor.press('ControlOrMeta+End')
  await editor.press('ControlOrMeta+Shift+e')
  await expect(editor).toHaveText('div>+p')
  await expect(page.locator('.lab-emmet-message')).toContainText('Tu código se conserva')
  await editor.fill('p*1000{Texto largo}')
  await editor.press('ControlOrMeta+End')
  await page
    .getByRole('button', { name: 'Expandir abreviatura Emmet en HTML', exact: true })
    .click()
  // This expansion is over the laboratory's 12,000-character limit.
  await expect(editor).toHaveText('p*1000{Texto largo}')
  await expect(page.locator('.lab-emmet-message')).toContainText('tamaño permitido')
})

test('properties share Emmet while read-only examples remain unchanged and mobile controls fit', async ({
  page,
}) => {
  await page.goto('/propiedades/margen')
  await expect(page.getByRole('button', { name: /Expandir abreviatura Emmet/ })).toHaveCount(1)
  const readonly = page.getByRole('textbox', { name: 'HTML del ejemplo', exact: true })
  await expect(readonly).toHaveAttribute('aria-readonly', 'true')
  const initial = await readonly.textContent()
  await readonly.press('ControlOrMeta+Shift+e')
  await expect(readonly).toHaveText(initial!)
  const editor = page.getByRole('textbox', { name: 'Tu CSS', exact: true })
  await editor.fill('.muestra {\n  m24\n}')
  await editor.press('ControlOrMeta+End')
  await editor.press('ArrowUp')
  await editor.press('End')
  await editor.press('ControlOrMeta+Shift+e')
  await expect(editor).toContainText('margin: 24px;')
  await page.getByRole('button', { name: 'Comprobar', exact: true }).click()
  await expect(page.locator('.property-validation [role="status"]')).toContainText('+60 XP')
  await page.setViewportSize({ width: 320, height: 900 })
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    .toBe(true)
})
