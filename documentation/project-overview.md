# Employee Management System (EMS) Frontend Client

This is an Employee Management System (EMS) frontend client built with React, TypeScript, and Vite. It's designed for companies to manage their employees, attendance, leave, and payroll through a web interface with role-based access.

## Project Purpose

The EMS client provides a centralized platform for HR and administrative tasks, allowing different user roles (admins, employees, users) to interact with employee data, track attendance via QR codes, manage leave requests, handle salary configurations and payments, and view analytics.

## Main Functions

Based on the codebase structure and components:

### Authentication & Authorization

- User login and registration
- Role-based routing (ADMIN, EMPLOYEE, USER)
- Protected routes with JWT token handling
- Forgot password functionality

### Admin Features

- **Dashboard**: Overview of total employees, users, today's attendance, and attendance analytics chart
- **Employee Management**: Add, edit, assign roles, and manage user accounts
- **Attendance Management**: Mark attendance, view summaries, generate QR codes for scanning
- **Leave Management**: Approve/reject employee leave requests
- **Salary Management**: Configure salary structures, process payments, view salary summaries
- **System Settings**: General configuration options

### Employee Features

- **Dashboard**: Welcome message and QR attendance scanning
- **Leave Management**: Request and view leave status
- **Profile Management**: View and update personal information

### User Features

- **Dashboard**: Basic welcome and account status
- **Profile Management**: View and update personal information

### Shared Features

- **User Profile**: Edit personal details across all roles
- **Responsive UI**: Built with Tailwind CSS for mobile and desktop
- **Charts and Analytics**: Attendance visualization using Recharts
- **QR Code Integration**: For attendance tracking
- **PDF/Excel Export**: For reports and summaries
- **Toast Notifications**: For user feedback

The system integrates with a backend API (likely Spring Boot based on the project path) for data persistence and business logic.
