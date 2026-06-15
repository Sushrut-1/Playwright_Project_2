Feature: Login
  As a user
  I want to log into the application
  So that I can access secure pages

  Scenario: Successful login with valid credentials
    Given I open the login page
    When I submit valid credentials
    Then I should see the dashboard
