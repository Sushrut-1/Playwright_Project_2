const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://hotel-example-site.takeyaqa.dev/en-US/plans.html', { waitUntil: 'networkidle' });
  console.log('page', page.url());
  const cards = page.locator('div.card');
  const count = await cards.count();
  console.log('card count', count);
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const text = (await card.innerText()).trim().replace(/\s+/g,' ');
    const reserve = await card.locator('a', { hasText: 'Reserve room' }).count();
    const plan = await card.locator('h2, h3, h4, strong, div').first().innerText().catch(()=>'');
    console.log('\ncard', i, 'reserveLinks', reserve, 'planText', plan.slice(0,80));
    console.log(text.slice(0,240));
  }
  await browser.close();
})();
