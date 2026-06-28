const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = 'https://hotel-example-site.takeyaqa.dev/en-US';
  const reserveIds = [0,4,5,6,7,8,9];
  for (const id of reserveIds) {
    const url = `${base}/reserve.html?plan-id=${id}`;
    await page.goto(url, { waitUntil:'networkidle' });
    console.log('\n=== reserve id', id, 'url', page.url());
    const title = await page.title();
    console.log('title', title);
    const header = await page.locator('h1,h2,h3').first().innerText().catch(()=>'');
    console.log('header', header);
    const formCount = await page.locator('form').count();
    console.log('forms', formCount);
    const buttons = await page.locator('button, input[type=submit], input[type=button]').all();
    for (let i=0;i<buttons.length;i++){
      const btn=buttons[i];
      const txt=(await btn.evaluate(el => el.innerText || el.value || '')).trim().replace(/\s+/g,' ');
      const type = await btn.getAttribute('type');
      console.log('button',i, type, txt);
    }
    const fields = await page.locator('input,select,textarea').all();
    for (let i=0;i<fields.length;i++){
      const el=fields[i];
      const tag=await el.evaluate(e=>e.tagName);
      const id=await el.getAttribute('id');
      const name=await el.getAttribute('name');
      const type=await el.getAttribute('type');
      const placeholder=await el.getAttribute('placeholder');
      const text = (await el.evaluate(e=> e.value || e.innerText || '')).toString().trim().replace(/\s+/g,' ');
      const label = await el.evaluate(e => {
        const id = e.id;
        if (!id) return '';
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.innerText.trim().replace(/\s+/g,' ') : '';
      });
      console.log(' field', i, tag, 'id=' + id, 'name=' + name, 'type=' + type, 'placeholder=' + placeholder, 'label=' + label, 'value=' + text.slice(0,120));
    }
    const texts = await page.locator('body').evaluate(el => el.innerText);
    if (texts.includes('Special Offer') || texts.includes('Additional Plan')) {
      console.log('page text includes special plan keywords');
    }
  }
  await browser.close();
})();
