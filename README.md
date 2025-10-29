# Employee Management System (EMS) Frontend Client

[![Frontend Repository](https://img.shields.io/badge/Frontend-https%3A%2F%2Fgithub.com%2Fsahilo5%2Fems--client%2Ftree%2Fmain-blue)](https://github.com/sahilo5/ems-client/tree/main)
[![Backend Repository](https://img.shields.io/badge/Backend-https%3A%2F%2Fgithub.com%2Fsahilo5%2Fems--service-blue)](https://github.com/sahilo5/ems-service)

A modern, responsive web application for comprehensive employee management, built with cutting-edge technologies to streamline HR operations and enhance productivity.

## 📋 Project Summary

The Employee Management System (EMS) Frontend Client is a sophisticated web platform designed to empower organizations with efficient employee lifecycle management. Leveraging React, TypeScript, and Vite, this application provides role-based access for administrators, employees, and users to handle attendance tracking, leave management, salary processing, and more through an intuitive interface.

## ✨ Key Features

### 🔐 Authentication & Security
- Secure login and registration system
- JWT-based authentication with protected routes
- Role-based access control (Admin, Employee, User)
- Password recovery functionality

### 👨‍💼 Admin Dashboard
- Comprehensive overview with analytics and charts
- Employee lifecycle management (add, edit, assign roles)
- Attendance management with QR code generation
- Leave request approval/rejection
- Salary configuration and payment processing
- System settings and configuration

### 👷 Employee Portal
- QR code-based attendance scanning
- Leave request submission and tracking
- Personal profile management
- Dashboard with personalized insights

### 👤 User Interface
- Basic account management
- Profile updates
- Responsive design for all devices

### 📊 Analytics & Reporting
- Interactive charts for attendance visualization
- Salary summaries and reports
- Expense tracking and ledger reports
- PDF and Excel export capabilities

### 🎨 User Experience
- Modern, responsive UI built with Tailwind CSS
- Toast notifications for user feedback
- Mobile-friendly design
- Fast loading with Vite bundler

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript for robust development
- **Vite** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Lucide React** - Beautiful icon library

### Key Libraries
- **React Router DOM** - Client-side routing
- **Recharts** - Declarative charting library
- **QR Code Integration** - For attendance tracking
- **JWT Decode** - Token handling
- **Day.js** - Date manipulation
- **jsPDF & jsPDF-AutoTable** - PDF generation
- **XLSX** - Excel file handling
- **UUID** - Unique identifier generation

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - Type-aware linting
- **Vite Plugins** - Optimized development experience

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahilo5/ems-client.git
   cd ems-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `src/config.ts` with your backend API endpoints
   - Ensure the backend service is running

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📖 Usage

### For Administrators
1. Log in with admin credentials
2. Access the dashboard for system overview
3. Manage employees, attendance, and payroll
4. Generate reports and analytics

### For Employees
1. Log in with employee credentials
2. Scan QR codes for attendance
3. Submit leave requests
4. View personal information and salary details

### For Users
1. Log in with user credentials
2. Update profile information
3. Access basic account features

## 🤝 Contributing

We welcome contributions to improve the EMS Frontend Client! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style with ESLint
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed


---

**Built with ❤️ for efficient employee management**
