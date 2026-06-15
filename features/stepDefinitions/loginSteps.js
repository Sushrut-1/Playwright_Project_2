const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const LoginPage = require('../../pages/LoginPage');
const config = require('../../utils/config');

Given('I open the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When('I submit valid credentials', async function () {
  await this.loginPage.login(config.username, config.password);
});

Then('I should see the dashboard', async function () {
  const isVisible = await this.loginPage.isDashboardVisible();
  expect(isVisible).to.equal(true);
});
