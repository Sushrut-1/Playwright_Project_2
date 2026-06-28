const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = 'https://hotel-example-site.takeyaqa.dev/en-US/index.html';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const reserveLink = page.locator('a:has-text("Reserve")').first();
  if (await reserveLink.count() > 0) {
    await reserveLink.click();
    await page.waitForLoadState('networkidle');
    console.log('navigated to', page.url());
  } else {
    console.log('Reserve link not found');
    await browser.close();
    return;
  }
  const selectors = [
    'input[type="date"]',
    'input[type="number"]',
    'input[type="email"]',
    'input[type="text"]',
    'input',
    'button',
    'select',
    'label',
    'form',
    'section',
    'div',
    'span'
  ];
  for (const s of selectors) {
    const count = await page.locator(s).count();
    console.log(`${s} => ${count}`);
    if (count > 0 && count < 30) {
      for (let i = 0; i < count; i++) {
        const e = page.locator(s).nth(i);
        const tag = await e.evaluate(el => el.tagName);
        const id = await e.evaluate(el => el.id);
        const name = await e.evaluate(el => el.getAttribute('name'));
        const type = await e.evaluate(el => el.getAttribute('type'));
        const text = (await e.evaluate(el => el.innerText || el.value || '')).toString().trim().replace(/\s+/g,' ');
        const aria = await e.evaluate(el => el.getAttribute('aria-label'));
        console.log('   ', i, tag, id, name, type, aria, text.slice(0,120));
      }
    }
  }
  await browser.close();
})();
