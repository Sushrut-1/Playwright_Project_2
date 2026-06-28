const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/reserve.html?plan-id=0', { waitUntil: 'networkidle' });
  const data = {
    date: '07/28/2026',
    term: '2',
    guests: '4',
    breakfast: true,
    early: true,
    sightseeing: true,
    name: 'sushrut',
    contact: 'By email',
    email: 'sushrut@example.com',
    comment: 'Testing special request'
  };
  await page.locator('#date').fill(data.date);
  await page.locator('#term').fill(data.term);
  await page.locator('#head-count').fill(data.guests);
  if (data.breakfast) await page.locator('#breakfast').check();
  if (data.early) await page.locator('#early-check-in').check();
  if (data.sightseeing) await page.locator('#sightseeing').check();
  await page.locator('#username').fill(data.name);
  await page.locator('#contact').selectOption({ label: data.contact });
  await page.locator('#email').fill(data.email);
  await page.locator('#comment').fill(data.comment);
  const totalText = await page.locator('text=Total').evaluate(el => el.closest('div') ? el.closest('div').innerText : el.innerText).catch(()=>'');
  console.log('total block text:', totalText);
  const totalElem = await page.locator('text=Total').first();
  const totalValue = totalElem.evaluate(el => {
    const text = el.closest('div')?.innerText || el.innerText;
    const match = text.match(/\$[0-9,.]+/);
    return match ? match[0] : null;
  });
  console.log('total amount', await totalValue);
  await page.click('button:has-text("Confirm Reservation")');
  await page.waitForLoadState('networkidle');
  console.log('after submit url', page.url());
  const body = await page.locator('body').innerText();
  console.log('body snippet:', body.slice(0, 1200));
  await browser.close();
})();
