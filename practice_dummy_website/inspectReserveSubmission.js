const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/reserve.html?plan-id=0', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const date = document.querySelector('#date');
    date.value = '07/28/2026';
    date.dispatchEvent(new Event('input', { bubbles: true }));
    date.dispatchEvent(new Event('change', { bubbles: true }));
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
  await page.waitForTimeout(1000);
  const total = await page.locator('text=Total').first().evaluate(el => el.closest('div') ? el.closest('div').innerText : el.innerText);
  console.log('total text:', total);
  await page.locator('button:has-text("Confirm Reservation")').click();
  await page.waitForLoadState('networkidle');
  console.log('after confirm url', page.url());
  const bodyText = await page.locator('body').innerText();
  console.log('body contains sushrut', bodyText.includes('sushrut'));
  console.log('body contains By email', bodyText.includes('By email'));
  console.log('body contains Testing special request', bodyText.includes('Testing special request'));
  console.log('body tail', bodyText.slice(0, 1200));
  await browser.close();
})();
