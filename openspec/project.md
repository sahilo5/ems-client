# Project Context

## Purpose
This project is an Employee Management System (EMS) client application. Its purpose is to provide a user interface for managing employees, attendance, salaries, leaves, and other administrative tasks.

## Tech Stack
- **TypeScript**: For static typing and improved code quality.
- **React**: For building the user interface.
- **Vite**: As the build tool and development server.
- **React Router**: For handling routing within the application.
- **Tailwind CSS**: For styling the application with a utility-first CSS framework.
- **ESLint**: For code linting to maintain consistent code style.

## Project Conventions

### Code Style
The project follows the recommended ESLint rules for JavaScript, React, and TypeScript. Key conventions include:
- **Component Naming**: Components are named using PascalCase (e.g., `UserManagement`).
- **File Naming**: Component files are named using PascalCase (e.g., `Button.tsx`).
- **Hooks**: Custom hooks are used for stateful logic and are named with the `use` prefix (e.g., `useUserManagement`).
- **Formatting**: Code formatting is enforced by ESLint to ensure consistency.

### Architecture Patterns
- **Component-Based Architecture**: The UI is built using a hierarchy of reusable React components located in `src/components`.
- **Feature-Based Structure**: The application is organized by features/pages within the `src/pages` directory.
- **Custom Hooks**: Business logic and state management are encapsulated within custom hooks (e.g., `src/pages/admin/UserManagement.hooks.ts`).
- **Centralized Routing**: Application routes are defined in the `src/routes` directory.
- **API Abstraction**: A centralized API utility in `src/utils/api.ts` is used for all backend communication.

### Testing Strategy
[Explain your testing approach and requirements]

### Git Workflow
[Describe your branching strategy and commit conventions]

## Domain Context
The application revolves around managing employee-related data. Key domain concepts include:
- **Users**: Employees and administrators of the system.
- **Roles**: Permissions and access levels for users.
- **Attendance**: Tracking employee check-in and check-out times.
- **Leave**: Managing employee leave requests.
- **Salary**: Handling salary payments and configurations.

## Important Constraints
There are no major technical, business, or regulatory constraints at the moment.

## External Dependencies
- **Backend API**: The application relies on an external backend API for data persistence and business logic. All API calls are made through the `api` utility.
