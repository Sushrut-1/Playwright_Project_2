const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = 'https://hotel-example-site.takeyaqa.dev/en-US/index.html';
  console.log('goto', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  console.log('title', await page.title());
  const selectors = [
    'text=Reserve',
    'button:has-text("Reserve")',
    '#reserve',
    '[name="reserve"]',
    'input[type="date"]',
    'input[type="tel"]',
    'input[type="email"]',
    'button:has-text("Confirm reservation")',
    'button:has-text("Submit reservation")',
    'text=Special Offers',
    'text=Additional Plan',
    'text=Breakfast',
    'text=Early check in',
    'text=Sightseeing'
  ];
  for (const s of selectors) {
    const locator = page.locator(s);
    const count = await locator.count();
    console.log(`${s} => ${count}`);
    if (count && count < 20) {
      for (let i = 0; i < count; i++) {
        const e = locator.nth(i);
        const tag = await e.evaluate(el => el.tagName);
        const id = await e.evaluate(el => el.id);
        const name = await e.evaluate(el => el.getAttribute('name'));
        const type = await e.evaluate(el => el.getAttribute('type'));
        const text = (await e.evaluate(el => el.innerText)).trim().replace(/\s+/g,' ');
        console.log('   ', i, tag, id, name, type, text);
      }
    }
  }
  await browser.close();
})();
