## ADDED Requirements
### Requirement: Add Other Payments
The system SHALL allow administrators to add other payments for employees, such as bonuses, travel expenses, and rental expenses.

#### Scenario: Add a new payment
- **GIVEN** the administrator is on the "Other Payments" page
- **WHEN** the administrator fills out the new payment form with a payment type, amount, and description
- **AND** clicks the "Save" button
- **THEN** the new payment is saved and appears in the list of previous payments.

### Requirement: View Other Payments
The system SHALL display a list of previous "other" payments made to employees.

#### Scenario: View previous payments
- **GIVEN** the administrator is on the "Other Payments" page
- **WHEN** the page loads
- **THEN** a browse view is displayed with a list of all previous payments, including the payment type, amount, and date.