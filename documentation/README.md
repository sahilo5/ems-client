# Employee Management System (EMS)

## Project Overview

This is a comprehensive Employee Management System (EMS) built with React. It provides a role-based access control system for administrators, employees, and users, with a wide range of features for managing employees, attendance, leave, salaries, and more.

## Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Core Framework** | React | A JavaScript library for building user interfaces. |
| **Build Tool** | Vite | A fast and modern build tool for web development. |
| **Language** | TypeScript | A typed superset of JavaScript that compiles to plain JavaScript. |
| **Styling** | Tailwind CSS | A utility-first CSS framework for rapid UI development. |
| **Routing** | React Router | A declarative routing library for React. |
| **Data Visualization** | Recharts | A composable charting library built on React components. |
| **QR Codes** | qrcode.react, @yudiel/react-qr-scanner | Libraries for generating and scanning QR codes. |
| **Document Generation** | jspdf, xlsx | Libraries for generating PDFs and Excel files. |
| **Icons** | lucide-react | A library of simply beautiful icons. |
| **Authentication** | jwt-decode | A small browser library that helps decoding JWTs token which are Base64Url encoded. |

## Component Hierarchy

```mermaid
graph TD
    A[App] --> B{Router};
    B --> C{Routes};
    C --> D[Login Page];
    C --> E[Register Page];
    C --> F{Protected Routes};
    F --> G[Dashboard Layout];
    G --> H[Navbar];
    G --> I[Sidebar];
    G --> J{Role-Based Routes};
    J --> K[Admin Dashboard];
    J --> L[Employee Dashboard];
    J --> M[User Dashboard];