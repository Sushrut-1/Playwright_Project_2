// pages/LoginPage.js
const { expect } = require('@playwright/test');

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // --- Locators ---
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.erroremailMessage = page.locator('#email-message');
        this.erroepasswordMessage = page.locator('#password-message');
        this.emailValidationError = page.locator('#email-message');
        this.authErrorMessage = page.locator('#email-message');
        this.membershipType = page.locator('#rank');
        this.logoutButton = page.locator('//button[text()="Logout"]');
    }

    async navigateTo(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillEmail(email) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(email, password) {
        await this.fillEmail(email);
        await this.fillPassword(password);
    }

    async waitForLoginSuccess() {
        await expect(this.logoutButton).toBeVisible({ timeout: 10000 });
    }

    async getPasswordInputType() {
        return await this.passwordInput.getAttribute('type');
    }

    async logout() {
        await this.logoutButton.click();
    }
}

module.exports = LoginPage;