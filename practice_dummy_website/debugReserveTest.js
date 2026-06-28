const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/plans.html', { waitUntil: 'networkidle' });
  const plan = page.locator('div.card', { hasText: 'Plan with special offers' }).first();
  const link = plan.locator('a', { hasText: 'Reserve room' }).first();
  console.log('link href', await link.getAttribute('href'));
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    link.click(),
  ]);
  await newPage.waitForLoadState('networkidle');
  console.log('new page url', newPage.url());
  console.log('date count', await newPage.locator('#date').count());
  console.log('date visible', await newPage.locator('#date').isVisible().catch(() => false));
  await newPage.evaluate(() => {
    const d = document.querySelector('#date');
    d.value = '07/28/2026';
    d.dispatchEvent(new Event('input', { bubbles: true }));
    d.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await newPage.fill('#term', '2');
  await newPage.fill('#head-count', '4');
  await newPage.evaluate(() => {
    document.querySelector('#breakfast').checked = true;
    document.querySelector('#breakfast').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#early-check-in').checked = true;
    document.querySelector('#early-check-in').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#sightseeing').checked = true;
    document.querySelector('#sightseeing').dispatchEvent(new Event('change', { bubbles: true }));
  });
  await newPage.fill('#username', 'sushrut');
  await newPage.selectOption('#contact', { label: 'By email' });
  await newPage.fill('#email', 'sushrut@example.com');
  await newPage.fill('#comment', 'Testing special request');
  await newPage.waitForTimeout(2000);
  const body = await newPage.locator('body').innerText();
  console.log('body includes Total', body.includes('Total'));
  const totalMatch = body.match(/Total[^\$]*\$([0-9,]+(?:\.[0-9]{2})?)/i);
  console.log('total match', totalMatch);
  console.log('body snippet', body.slice(0, 1200).replace(/\s+/g,' '));
  await browser.close();
})();
