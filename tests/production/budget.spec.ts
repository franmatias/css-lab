import { expect, test } from '@playwright/test'
import { gzipSync } from 'node:zlib'

test('complete initial JavaScript stays under 150 kB gzip, including lazy startup chunks', async ({
  page,
}, testInfo) => {
  const scripts = new Map<string, Promise<number>>()
  page.on('response', (response) => {
    const url = response.url()
    if (response.request().resourceType() === 'script' && !scripts.has(url))
      scripts.set(
        url,
        response.body().then((body) => gzipSync(body).byteLength),
      )
  })
  await page.goto('/css-lab/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /Da forma a tus ideas/ })).toBeVisible()
  const resources = await Promise.all(
    [...scripts].map(async ([url, size]) => ({ url, gzipBytes: await size })),
  )
  const total = resources.reduce((sum, item) => sum + item.gzipBytes, 0)
  await testInfo.attach('initial-javascript.json', {
    body: JSON.stringify({ resources, total, budget: 150_000 }, null, 2),
    contentType: 'application/json',
  })
  expect(resources.length).toBeGreaterThan(0)
  expect(total, JSON.stringify(resources)).toBeLessThan(150_000)
})
