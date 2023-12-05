import { test, expect, type Page } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/memoria');

  await expect(page).toHaveTitle(/Memoria/);
});

test.describe.serial('autoplay', async () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('results in a winning screen', async () => {
    await page.goto('/memoria');

    await page.waitForLoadState('networkidle');

    await page.keyboard.press('A');

    await expect(page.getByText('Grats!')).toBeVisible();
  });

  test('all cards are rotated', async () => {
    await expect(page.getByRole('gridcell').first()).toBeVisible();

    for (const cell of await page.getByRole('gridcell').all()) {
      await expect(cell).toHaveAttribute('data-rotated', 'true');
    }
  });

  test('clicking Play from winning screen resets the game', async () => {
    await page.getByText('Play').click();

    for (const cell of await page.getByRole('gridcell').all()) {
      await expect(cell).toHaveAttribute('data-rotated', 'false');
    }
  });
});
