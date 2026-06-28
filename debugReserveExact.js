const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/plans.html', { waitUntil: 'networkidle' });
  const plan = page.locator('div.card', { hasText: 'Plan with special offers' }).first();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    plan.locator('a', { hasText: 'Reserve room' }).click(),
  ]);
  await newPage.waitForLoadState('networkidle');
  console.log('reserve url', newPage.url());
  console.log('initial term', await newPage.locator('#term').inputValue());
  console.log('initial guests', await newPage.locator('#head-count').inputValue());
  await newPage.locator('#term').fill('2');
  await newPage.locator('#head-count').fill('4');
  await newPage.locator('#breakfast').check();
  await newPage.locator('#early-check-in').check();
  await newPage.locator('#sightseeing').check();
  await newPage.locator('#username').fill('sushrut');
  await newPage.locator('#contact').selectOption({ label: 'By email' });
  await newPage.locator('#email').fill('sushrut@example.com');
  await newPage.locator('#comment').fill('Testing special request');
  await newPage.waitForTimeout(1000);
  console.log('filled term', await newPage.locator('#term').inputValue());
  console.log('filled guests', await newPage.locator('#head-count').inputValue());
  console.log('filled date', await newPage.locator('#date').inputValue());
  console.log('filled breakfast', await newPage.locator('#breakfast').isChecked());
  console.log('filled early', await newPage.locator('#early-check-in').isChecked());
  console.log('filled sightseeing', await newPage.locator('#sightseeing').isChecked());
  console.log('filled name', await newPage.locator('#username').inputValue());
  console.log('filled contact', await newPage.locator('#contact').inputValue());
  console.log('filled email', await newPage.locator('#email').inputValue());
  console.log('filled comment', await newPage.locator('#comment').inputValue());
  console.log('body snippet', (await newPage.locator('body').innerText()).slice(0, 400).replace(/\s+/g,' '));
  await newPage.click('button:has-text("Confirm Reservation")');
  await newPage.waitForURL(/confirm\.html$/);
  const confirmText = await newPage.locator('body').innerText();
  console.log('confirm url', newPage.url());
  console.log('confirm snippet', confirmText.slice(0, 400).replace(/\s+/g,' '));
  await browser.close();
})();
