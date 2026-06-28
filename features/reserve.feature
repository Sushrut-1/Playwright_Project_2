Feature: Hotel Planisphere - Reservation with Special Offers
  As a guest of the hotel site
  I want to reserve a special offer room and verify the reservation flow
  So that the selected details are displayed correctly on confirmation

  Scenario: Reserve the room for Plan with special offers
    Given the user opens the hotel plans page
    Then the special offers card should be visible
    When the user selects the special offers plan and navigates to reserve
    When the user fills the reservation details with:
      | field           | value                    |
      | stayNights      | 2                        |
      | guests          | 4                        |
      | breakfast       | true                     |
      | earlyCheckIn    | true                     |
      | sightseeing     | true                     |
      | name            | sushrut                  |
      | confirmation    | By email                 |
      | email           | sushrut@example.com      |
      | specialRequest  | Testing special request  |
    Then the total price should update accordingly
    When the user confirms the reservation
    Then the confirmation reservation page should display the selected details correctly
    When the user submits the reservation
    Then the submit reservation action should be available
