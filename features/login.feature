Feature: Hotel Planisphere - Comprehensive Login Functionality
  As a user of the hotel booking portal
  I want to log into the application with various scenarios
  So that I can verify the login functionality, UI validation, and session management

  Background:
    Given the user navigates to the login page "https://hotel-example-site.takeyaqa.dev/en-US/login.html"


  @smoke @positive
  Scenario Outline: 1. Login with valid details
    When the user enters email "<email>" and password "<password>"
    And clicks on the login button
    Then the user should be successfully logged in
    And the user should be redirected to My Page
    And the user profile description should display membership type as "<membership>"

    Examples:
      | email             | password  | membership |
      | clark@example.com | password  | premium    |
      | diana@example.com | pass1234  | normal     |
      | ororo@example.com | pa55w0rd! | premium    |
      | miles@example.com | pass-pass | normal     |

  @negative
  Scenario: 2. Login without adding anything (Blank fields)
    When the user clicks on the login button without entering details
    Then the system should display validation errors for required email and password fields

  @negative
  Scenario Outline: 3. Login with invalid password for valid email
    When the user enters email "<email>" and password "<password>"
    And clicks on the login button
    Then the system should display an authentication error message "Email or password is invalid."

    Examples:
      | email             | password  |
      | clark@example.com | password1 |

  @ui @security
  Scenario: 4. Verify password masking for security
    When the user enters any characters in the password field
    Then the password input attribute "type" should be "password"
    And the characters should be masked on the UI

  @negative @validation
  Scenario Outline: 5. Verify email format validation
    When the user enters an invalid email format "<invalid_email>" and password "pass1234"
    And clicks on the login button
    Then the system should display an appropriate email format validation error

    Examples:
      | invalid_email     |
      | clark.com         |
      | clark@example     |
      | @example.com      |

  @positive @data-handling
  Scenario Outline: 6. Verify login after trimming leading and trailing spaces in email
    When the user enters email with spaces "<spaced_email>" and password "<password>"
    And clicks on the login button
    Then the user should be successfully logged in
    And the user should be redirected to My Page

    Examples:
      | spaced_email         | password |
      |  clark@example.com   | password |
      | diana@example.com    | pass1234 |

  @session @positive
  Scenario: 7. Verify session persistence on page refresh
    When the user enters email "clark@example.com" and password "password"
    And clicks on the login button
    And the user refreshes the browser page
    Then the user should still remain logged in on My Page

  @session @security
  Scenario: 8. Verify session invalidation after logout
    When the user enters email "clark@example.com" and password "password"
    And clicks on the login button
    And the user clicks on the logout button
    And the user tries to navigate directly to My Page URL "https://hotel-example-site.takeyaqa.dev/en-US/mypage.html"
    Then the user should be restricted and redirected back to the login page