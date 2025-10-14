## Why
The current salary management system lacks the functionality to handle payments other than the base salary, such as bonuses, travel expenses, and rental allowances. This proposal aims to add a feature that allows administrators to manage these additional payments efficiently.

## What Changes
- A new "Other Payments" section will be added to the Salary Management page.
- Administrators will be able to add new payments with a dropdown menu to select the payment type (e.g., bonus, travel expense, rental expense, other).
- A browse view will be added to display a history of previous payments.
- A "Add New Payment" button will be added to the header actions to trigger the new payment functionality.

## Impact
- **Affected specs**: A new capability for "Other Payments" will be added, and the existing "Salary Management" capability will be modified.
- **Affected code**:
  - `src/pages/admin/SalaryManagement.tsx`
  - `src/pages/admin/OtherPayments.tsx`
  - `src/components/Browse.tsx`
  - `src/components/Button.tsx`
  - `src/components/Dropdown.tsx`