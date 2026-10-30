import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('theory presents distinct ideas and HTML and selectors use two columns that reflow on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const path of ['/teoria/m5', '/catalogo/m5-posicion']) {
    await page.goto(path)
    if (path.startsWith('/teoria')) await expect(page.locator('.lesson-ideas > li')).toHaveCount(5)
    const demo = page.locator('.selector-demo').first()
    await expect(demo.getByRole('heading', { name: 'Código HTML', exact: true })).toBeVisible()
    const grid = await demo.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' '),
    )
    expect(grid).toHaveLength(2)
    const selector = demo.getByRole('textbox', { name: 'Selector editable', exact: true })
    await selector.fill(':not(')
    await expect(demo).toContainText('Revisa la sintaxis')
  }
  await page.setViewportSize({ width: 320, height: 900 })
  expect(
    await page
      .locator('.selector-demo')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('every table solution selects the right nodes and handles pointer transitions', async ({
  page,
}) => {
  await page.goto('/juego/tablas')
  const failures = await page.evaluate(async () => {
    const contentPath = '/packages/content/src/tableGame.ts'
    const domainPath = '/src/domain/tableGame.ts'
    const { tableMissions } = await import(/* @vite-ignore */ contentPath)
    const { solveTableGame } = await import(/* @vite-ignore */ domainPath)
    return tableMissions
      .filter(
        (mission: { solution: string }) =>
          !solveTableGame(mission, mission.solution, 'celda-2-3').correct,
      )
      .map((mission: { id: string }) => mission.id)
  })
  expect(failures).toEqual([])
  await page
    .getByRole('textbox', { name: 'Tu selector para la tabla' })
    .fill('tbody > tr:nth-child(2) > td:nth-child(3)')
  await expect(page.locator('.selected-cell')).toHaveCount(1)
  await expect(page.locator('.selected-cell')).toContainText('8')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('+100 XP')
  await expect(page.locator('.table-board')).toHaveClass(/is-won/)
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('una sola vez')
  await page.reload()
  await expect(
    page.getByText('1 de 12 misiones de tablas completadas', { exact: true }),
  ).toBeVisible()
  await page.goto('/insignias')
  await page.getByRole('combobox', { name: 'Familia', exact: true }).selectOption('Juego de tablas')
  await expect(page.locator('.achievement-card.unlocked')).toContainText(['Una celda, una idea'])
  await page.goto('/juego')
  await expect(page.getByText('0 de 12 misiones completadas', { exact: true })).toBeVisible()
})

test('hover missions follow pointer, focus and the touch-friendly reference selector', async ({
  page,
}) => {
  await page.goto('/juego/tablas/tabla-hover-fila')
  const answer = page.getByRole('textbox', { name: 'Tu selector para la tabla' })
  await answer.fill('tbody > tr:nth-child(2)')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('todas las celdas')
  await answer.fill('tbody > tr:hover')
  const cell = page.getByRole('cell', { name: 'Luis, CSS: 8', exact: true })
  await cell.hover()
  await expect(page.locator('.selected-row')).toHaveCount(1)
  await expect(page.locator('.selected-row')).toContainText('Luis')
  await page.getByRole('cell', { name: 'Sara, CSS: 10', exact: true }).focus()
  await page.mouse.move(0, 0)
  await expect(page.locator('.selected-row')).toContainText('Sara')
  await page.getByRole('combobox', { name: 'Simular puntero sin ratón' }).selectOption('celda-4-3')
  await expect(page.locator('.selected-row')).toContainText('Omar')
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('+140 XP')
  await page.goto('/juego/tablas/tabla-hover-columna')
  await answer.fill(
    '.calificaciones:has(tbody > tr > td:nth-child(3):hover) tbody > tr > td:nth-child(3)',
  )
  await page.getByRole('combobox', { name: 'Simular puntero sin ratón' }).selectOption('celda-2-3')
  await expect(page.locator('.selected-cell')).toHaveCount(4)
  await page.getByRole('combobox', { name: 'Simular puntero sin ratón' }).selectOption('celda-2-2')
  await expect(page.locator('.selected-cell')).toHaveCount(0)
  await page.getByRole('button', { name: 'Comprobar misión', exact: true }).click()
  await expect(page.locator('.table-feedback')).toContainText('+180 XP')
})

test('table games and detailed teaching pages stay accessible in both themes and on mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/juego/tablas', '/teoria/m5', '/catalogo/m5-posicion']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const theme of ['light', 'dark']) {
      for (let step = 0; step < 3; step++) {
        const label = await page
          .getByRole('button', { name: /^Cambiar tema/ })
          .getAttribute('aria-label')
        if (label?.endsWith(theme === 'light' ? 'Claro' : 'Oscuro')) break
        await page.getByRole('button', { name: /^Cambiar tema/ }).click()
      }
      await expect(page.locator('body')).toHaveCSS(
        'color',
        theme === 'light' ? 'rgb(26, 27, 46)' : 'rgb(236, 237, 247)',
      )
      expect((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations).toEqual([])
    }
    await page.setViewportSize({ width: 320, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
