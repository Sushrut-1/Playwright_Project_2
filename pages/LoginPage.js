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
        this.errorMessage = page.locator('#error-message'); 
        this.emailValidationError = page.locator('#email-error'); 
        this.logoutButton = page.locator('#logout-button');
    }

    // --- Actions (Methods) ---

  //Go to the login page
    async navigateTo(url) {
        await this.page.goto(url);
    }

   //Login with credentials
    async login(email, password) {
        if (email !== null && email !== undefined) {
            await this.emailInput.fill(email);
        }
        if (password !== null && password !== undefined) {
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }

    //Click on LoginButton Without filling credentials (for validation testing)
    async clickLogin() {
        await this.loginButton.click();
    }

    // Verify error message text
    async getErrorMessageText() {
        return await this.errorMessage.textContent();
    }

    // Verify Input password is masked
    async getPasswordInputType() {
        return await this.passwordInput.getAttribute('type');
    }

    // Logout method
    async logout() {
        await this.logoutButton.click();
    }
}

module.exports = { LoginPage };