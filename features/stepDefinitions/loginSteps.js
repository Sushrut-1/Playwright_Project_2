var { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');

Given(`the user navigates to the login page {string}`, async function (url) {
    this.loginpage = new LoginPage(this.page);
    await this.loginpage.navigateTo(url);
});

When(`the user enters email {string} and password {string}`, async function (email, password) {
    await this.loginpage.login(email, password);
});

When(`clicks on the login button`, async function () {
    await this.loginpage.clickLogin();
});

Then(`the user should be successfully logged in`, async function () {
    await this.loginpage.waitForLoginSuccess();
});

Then(`the user should be redirected to My Page`, async function () {
    await expect(this.page).toHaveURL('https://hotel-example-site.takeyaqa.dev/en-US/mypage.html');
});

Then(`the user profile description should display membership type as {string}`, async function (membership) {
    await expect(this.loginpage.membershipType).toHaveText(new RegExp(`^${membership}$`, 'i'));
});

When(`the user clicks on the login button without entering details`, async function () {
    await this.loginpage.clickLogin();
});

Then(`the system should display validation errors for required email and password fields`, async function () {
    await expect(this.loginpage.erroremailMessage).toHaveText('Please fill out this field.');
    await expect(this.loginpage.erroepasswordMessage).toHaveText('Please fill out this field.');
});

Then(`the system should display an authentication error message {string}`, async function (message) {
    await expect(this.loginpage.authErrorMessage).toHaveText(message);
});

When(`the user enters any characters in the password field`, async function () {
    await this.loginpage.fillPassword('Secret123!');
});

Then(`the password input attribute {string} should be {string}`, async function (attribute, expectedValue) {
    await expect(this.loginpage.passwordInput).toHaveAttribute(attribute, expectedValue);
});

Then(`the characters should be masked on the UI`, async function () {
    const typeValue = await this.loginpage.getPasswordInputType();
    if (typeValue !== 'password') {
        throw new Error(`Expected password input to be masked, but type was '${typeValue}'.`);
    }
});

When(`the user enters an invalid email format {string} and password {string}`, async function (email, password) {
    await this.loginpage.login(email, password);
});

Then(`the system should display an appropriate email format validation error`, async function () {
    await expect(this.loginpage.emailValidationError).toBeVisible();
});

When(`the user enters email with spaces {string} and password {string}`, async function (email, password) {
    await this.loginpage.login(email, password);
});

When(`the user refreshes the browser page`, async function () {
    await this.page.reload();
});

Then(`the user should still remain logged in on My Page`, async function () {
    await this.loginpage.waitForLoginSuccess();
    await expect(this.page).toHaveURL('https://hotel-example-site.takeyaqa.dev/en-US/mypage.html');
});

When(`the user clicks on the logout button`, async function () {
    await this.loginpage.logout();
});

When(`the user tries to navigate directly to My Page URL {string}`, async function (url) {
    await this.page.goto(url);
});

Then(`the user should be restricted and redirected back to the login page`, async function () {
    const currentUrl = this.page.url();
    if (!/\/en-US\/(login|index)\.html$/.test(currentUrl)) {
        throw new Error(`Expected redirect to login or index page but got ${currentUrl}`);
    }
});