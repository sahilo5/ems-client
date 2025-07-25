// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/login/LoginFrom";
import RegisterForm from "./pages/register/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import './App.css'

// Routes
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import React from "react";
import DashboardLayout from "./pages/Layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {adminRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
        </Route>

        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {userRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
        </Route>

        {/* Employee Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {employeeRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
