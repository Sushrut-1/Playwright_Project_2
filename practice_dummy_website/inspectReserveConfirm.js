const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/reserve.html?plan-id=0', { waitUntil: 'networkidle' });
  console.log('reserve url', page.url());
  const body = await page.locator('body').innerText();
  console.log('body text first 1200 chars:\n', body.slice(0, 1200));
  console.log('\n--- Table of visible labels ---');
  const labels = await page.locator('label, span, strong, td, th, h1, h2, h3, p, div').all();
  let count = 0;
  for (let i = 0; i < labels.length; i++) {
    const el = labels[i];
    const text = (await el.innerText()).trim().replace(/\s+/g, ' ');
    if (text && /price|bill|total|reservation|special|breakfast|early|sightseeing|guest|name|email/i.test(text)) {
      console.log('text', i, text.slice(0, 120));
      count++;
      if (count >= 40) break;
    }
  }
  console.log('\n--- click confirm reservation ---');
  await page.click('button:has-text("Confirm Reservation")');
  await page.waitForLoadState('networkidle');
  console.log('after click url', page.url());
  const body2 = await page.locator('body').innerText();
  console.log('confirm page snippet:\n', body2.slice(0, 1200));
  await browser.close();
})();
