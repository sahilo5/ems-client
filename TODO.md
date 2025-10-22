# Reports Update TODO

## Overview
Replace the tabbed reports system with a single page form for generating reports.

## Tasks
- [x] Update Reports.tsx to remove tabs and use new form component
- [x] Create new GenerateReportForm component with:
  - Employee Name dropdown
  - Type dropdown (Salary, Attendance, Ledger, etc.)
  - Month/Year radio buttons
  - Conditional month/year selector
  - Generate report button
- [x] Create useGenerateReport hook for form logic and API calls
- [x] Remove old report components (AttendanceReports, SalaryReports, ExpensesReports, LedgerReports)
- [x] Remove old report hooks (AttendanceReports.hooks, SalaryReports.hooks, ExpensesReports.hooks, LedgerReports.hooks)
