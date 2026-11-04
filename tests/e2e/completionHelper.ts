import type { Page } from '@playwright/test'

export async function dismissCompletion(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog', { name: /completad[ao]/i })
  if (await dialog.isVisible())
    await dialog.getByRole('button', { name: 'Continuar aprendiendo' }).click()
}
