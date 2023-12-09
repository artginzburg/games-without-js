import { test, expect, type Page } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/memoria');

  await expect(page).toHaveTitle(/Memoria/);
});

test('can be navigated to from home page', async ({ page }) => {
  await page.goto('');

  await page.getByRole('link', { name: 'memoria' }).click();

  await page.waitForURL('/memoria');

  await expect(page.getByRole('heading').textContent()).resolves.toBe('Memoria');
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

    let hidden = true;
    let retries = 0;
    do {
      retries++;
      await page.keyboard.press('A');
      try {
        const anyRotatedCard = await page.waitForSelector('[data-rotated="true"]', {
          timeout: 200,
        });
        hidden = await anyRotatedCard.isHidden();
      } catch {}
    } while (hidden && retries <= 10);

    await expect(page.getByText('Grats!')).toBeVisible();
  });

  test('all cards are rotated', async () => {
    await expect(page.getByRole('gridcell').first()).toBeVisible();

    for (const cell of await page.getByRole('gridcell').all()) {
      await expect(cell).toHaveAttribute('data-rotated', 'true');
    }
  });

  test('back and forward navigation', async () => {
    await page.goBack();
    await page.goBack();

    const anyNonRotatedCard = await page.waitForSelector('[data-rotated="false"]');
    expect(await anyNonRotatedCard.isVisible()).toBe(true);

    await page.goForward();
    await page.goForward();
  });

  test('clicking Play from winning screen resets the game', async () => {
    await page.getByTitle('Play').click();

    for (const cell of await page.getByRole('gridcell').all()) {
      await expect(cell).toHaveAttribute('data-rotated', 'false');
    }
  });
});
