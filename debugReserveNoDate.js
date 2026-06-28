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
  console.log('date field visible', await newPage.locator('#date').isVisible().catch(() => false));
  await newPage.fill('#term', '2');
  await newPage.fill('#head-count', '4');
  await newPage.check('#breakfast');
  await newPage.check('#early-check-in');
  await newPage.check('#sightseeing');
  await newPage.fill('#username', 'sushrut');
  await newPage.selectOption('#contact', { label: 'By email' });
  await newPage.fill('#email', 'sushrut@example.com');
  await newPage.fill('#comment', 'Testing special request');
  await newPage.waitForTimeout(2000);
  const body = await newPage.locator('body').innerText();
  console.log('reserve body includes Total', body.includes('Total'));
  const totalMatch = body.match(/Total[^\$]*\$([0-9,]+(?:\.[0-9]{2})?)/i);
  console.log('total match', totalMatch && totalMatch[0]);
  await newPage.click('button:has-text("Confirm Reservation")');
  await newPage.waitForURL(/confirm\.html$/);
  console.log('confirm url', newPage.url());
  const confirmText = await newPage.locator('body').innerText();
  console.log('confirm snippet', confirmText.slice(0, 1200).replace(/\s+/g,' '));
  console.log('confirm contains', {
    plan: confirmText.includes('Plan with special offers'),
    nights: confirmText.includes('2 night(s)'),
    guests: confirmText.includes('4 person(s)'),
    breakfast: confirmText.includes('Breakfast'),
    early: confirmText.includes('Early check-in'),
    sightseeing: confirmText.includes('Sightseeing'),
    name: confirmText.includes('sushrut'),
    email: confirmText.includes('Email: sushrut@example.com'),
    request: confirmText.includes('Testing special request'),
  });
  await browser.close();
})();
