const { expect } = require('@playwright/test');

class ReservePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.setPage(page);
  }

  setPage(page) {
    this.page = page;
    this.planCard = page.locator('div.card', { hasText: 'Plan with special offers' });
    this.reserveRoomLink = this.planCard.locator('a', { hasText: 'Reserve room' });
    this.dateInput = page.locator('#date');
    this.termInput = page.locator('#term');
    this.guestsInput = page.locator('#head-count');
    this.breakfastCheckbox = page.locator('#breakfast');
    this.earlyCheckinCheckbox = page.locator('#early-check-in');
    this.sightseeingCheckbox = page.locator('#sightseeing');
    this.nameInput = page.locator('#username');
    this.confirmationSelect = page.locator('#contact');
    this.emailInput = page.locator('#email');
    this.commentInput = page.locator('#comment');
    this.confirmButton = page.locator('button', { hasText: 'Confirm Reservation' });
    this.submitButton = page.locator('button', { hasText: 'Submit Reservation' });
    this.totalLabel = page.locator('text=Total').first();
  }

  async openPlansPage() {
    await this.page.goto('https://hotel-example-site.takeyaqa.dev/en-US/plans.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectReserveRoomForSpecialOffers() {
    await expect(this.planCard).toBeVisible({ timeout: 10000 });
    const href = await this.reserveRoomLink.getAttribute('href');
    if (!href) {
      throw new Error('Reserve room link href not found');
    }
    const url = new URL(href, this.page.url()).toString();
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    this.setPage(this.page);
  }

  async verifySpecialOffersCardVisible() {
    await expect(this.planCard).toBeVisible({ timeout: 10000 });
  }

  async formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${month}/${day}/${year}`;
    }
    return dateString;
  }

  async fillCheckInDate(dateString) {
    const formatted = this.formatDate(dateString);
    await this.page.evaluate(({ selector, value }) => {
      const input = document.querySelector(selector);
      if (!input) throw new Error('Check-in date input not found');
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, { selector: '#date', value: formatted });
    await this.waitForTotalUpdate();
  }

  async setStayNights(nights) {
    await this.termInput.fill(String(nights));
    await this.waitForTotalUpdate();
  }

  async setGuests(count) {
    await this.guestsInput.fill(String(count));
    await this.waitForTotalUpdate();
  }

  async setCheckbox(locator, checked) {
    await locator.evaluate((input, value) => {
      if (input.checked !== value) {
        input.checked = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, checked);
    await this.waitForTotalUpdate();
  }

  async setAdditionalPlans(breakfast, earlyCheckIn, sightseeing) {
    await this.setCheckbox(this.breakfastCheckbox, breakfast);
    await this.setCheckbox(this.earlyCheckinCheckbox, earlyCheckIn);
    await this.setCheckbox(this.sightseeingCheckbox, sightseeing);
  }

  async uncheckAllAdditionalPlans() {
    await this.setAdditionalPlans(false, false, false);
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async selectConfirmationByEmail() {
    await this.confirmationSelect.selectOption({ label: 'By email' });
  }

  async verifyEmailInputVisible() {
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillSpecialRequest(request) {
    await this.commentInput.fill(request);
  }

  async clickConfirmReservation() {
    await this.confirmButton.click();
    await this.page.waitForURL(/confirm\.html$/);
  }

  async clickSubmitReservation() {
    await this.submitButton.click();
    await this.waitForTotalUpdate();
  }

  async verifyConfirmReservationPageDetails(details) {
    await expect(this.page).toHaveURL(/confirm\.html$/);
    const bodyText = await this.page.locator('body').innerText();
    expect(bodyText).toContain(details.planName);
    expect(bodyText).toContain(`${details.nights} night(s)`);
    expect(bodyText).toContain(`${details.guests} person(s)`);
    expect(bodyText).toContain('Breakfast');
    expect(bodyText).toContain('Early check-in');
    expect(bodyText).toContain('Sightseeing');
    expect(bodyText).toContain(details.name);
    expect(bodyText).toContain(`Email: ${details.email}`);
    expect(bodyText).toContain(details.request);
  }

  async verifySubmitReservationVisible() {
    await expect(this.submitButton).toBeVisible({ timeout: 10000 });
  }

  async getTotalPrice() {
    await this.page.waitForSelector('text=Total', { timeout: 10000 });
    const raw = await this.page.locator('body').innerText();
    const match = raw.match(/Total[^\$]*\$([0-9,]+(?:\.[0-9]{2})?)/i);
    if (!match) {
      throw new Error(`Unable to parse total price from page text: ${raw.slice(0, 200)}`);
    }
    return parseFloat(match[1].replace(/[,]/g, ''));
  }

  async waitForTotalUpdate() {
    await this.page.waitForSelector('text=Total', { timeout: 10000 });
  }
}

module.exports = ReservePage;
