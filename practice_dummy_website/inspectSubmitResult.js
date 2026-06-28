const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/reserve.html?plan-id=0', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const d = document.querySelector('#date');
    d.value = '07/28/2026'; d.dispatchEvent(new Event('input',{bubbles:true})); d.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.fill('#term', '2');
  await page.fill('#head-count', '4');
  await page.evaluate(() => {
    document.querySelector('#breakfast').checked = true;
    document.querySelector('#early-check-in').checked = true;
    document.querySelector('#sightseeing').checked = true;
  });
  await page.fill('#username', 'sushrut');
  await page.selectOption('#contact', { label: 'By email' });
  await page.fill('#email', 'sushrut@example.com');
  await page.fill('#comment', 'Testing special request');
  await page.click('button:has-text("Confirm Reservation")');
  await page.waitForLoadState('networkidle');
  const url1 = page.url();
  console.log('confirm url', url1);
  await page.click('button:has-text("Submit Reservation")');
  await page.waitForLoadState('networkidle');
  const url2 = page.url();
  console.log('after submit url', url2);
  const body = await page.locator('body').innerText();
  console.log('body includes Thank you', body.includes('Thank you'));
  console.log('body snippet:', body.slice(0, 800));
  await browser.close();
})();
