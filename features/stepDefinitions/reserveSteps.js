const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ReservePage = require('../../pages/ReservePage');

Given('the user opens the hotel plans page', async function () {
  this.reservePage = new ReservePage(this.page);
  await this.reservePage.openPlansPage();
});

When('the user selects the special offers plan and navigates to reserve', async function () {
  await this.reservePage.selectReserveRoomForSpecialOffers();
});

Then('the special offers card should be visible', async function () {
  await this.reservePage.verifySpecialOffersCardVisible();
});

When('the user fills the reservation details with:', async function (dataTable) {
  const data = Object.fromEntries(dataTable.rows());
  //await this.reservePage.fillCheckInDate(data.checkInDate);
  await this.reservePage.setStayNights(data.stayNights);
  await this.reservePage.setGuests(data.guests);
  await this.reservePage.setAdditionalPlans(
    data.breakfast === 'true',
    data.earlyCheckIn === 'true',
    data.sightseeing === 'true'
  );
  if (data.name) await this.reservePage.fillName(data.name);
  if (data.confirmation === 'By email') await this.reservePage.selectConfirmationByEmail();
  await this.reservePage.verifyEmailInputVisible();
  if (data.email) await this.reservePage.fillEmail(data.email);
  if (data.specialRequest) await this.reservePage.fillSpecialRequest(data.specialRequest);
});

Then('the total price should update accordingly', async function () {
  const total = await this.reservePage.getTotalPrice();
  if (total <= 0) {
    throw new Error(`Expected total price to be greater than 0, but got ${total}`);
  }
});

When('the user confirms the reservation', async function () {
  await this.reservePage.clickConfirmReservation();
});

Then('the confirmation reservation page should display the selected details correctly', async function () {
  await this.reservePage.verifyConfirmReservationPageDetails({
    planName: 'Plan with special offers',
    nights: 2,
    guests: 4,
    name: 'sushrut',
    email: 'sushrut@example.com',
    request: 'Testing special request'
  });
  await this.reservePage.verifySubmitReservationVisible();
});

When('the user submits the reservation', async function () {
  await this.reservePage.clickSubmitReservation();
});

Then('the submit reservation action should be available', async function () {
  await this.reservePage.verifySubmitReservationVisible();
});
