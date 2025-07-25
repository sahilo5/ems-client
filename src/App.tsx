// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/login/LoginFrom";
import RegisterForm from "./pages/register/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import React from "react";
import DashboardLayout from "./pages/Layouts/DashboardLayout";

function App() {
  const role = localStorage.getItem("userRole");

  let roleRoutes: Array<{ path: string; element: React.JSX.Element }> = [];

  if (role === "ADMIN") roleRoutes = adminRoutes;
  else if (role === "USER") roleRoutes = userRoutes;
  else if (role === "EMPLOYEE") roleRoutes = employeeRoutes;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Shared Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USER", "EMPLOYEE"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {roleRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
