import { expect, it } from 'vitest'
import { formatCode } from './formatCode'

it('formats HTML and CSS with newlines and configurable indentation', async () => {
  expect(await formatCode('<div><p>Hola</p></div>', 'html', { useTabs: false, tabWidth: 2 })).toBe(
    '<div>\n  <p>Hola</p>\n</div>\n',
  )
  expect(
    await formatCode('<div><p>Hola</p></div>', 'html', { useTabs: true, tabWidth: 4 }),
  ).toContain('\t<p>')
  expect(
    await formatCode('.nota{color:red;padding:8px}', 'css', { useTabs: false, tabWidth: 2 }),
  ).toBe('.nota {\n  color: red;\n  padding: 8px;\n}\n')
})
it('reports a malformed stylesheet instead of rewriting it', async () => {
  await expect(
    formatCode('.nota { color: red', 'css', { useTabs: false, tabWidth: 2 }),
  ).rejects.toThrow()
})

it('preserves meaningful inline adjacency, preformatted content and quoted attributes', async () => {
  const options = { useTabs: false, tabWidth: 2 }
  expect(await formatCode('<p>Hola<strong>mundo</strong></p>', 'html', options)).toContain(
    'Hola<strong>mundo</strong>',
  )
  expect(await formatCode('<pre><div><p>Texto</p></div></pre>', 'html', options)).toContain(
    '<pre><div><p>Texto</p></div></pre>',
  )
  expect(await formatCode('<div title="<div><p>">Texto</div>', 'html', options)).toContain(
    'title="<div><p>"',
  )
})
