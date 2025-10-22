import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/login/LoginFrom";
import RegisterForm from "./pages/register/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import { getRoutesByRole } from "./routes";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Loader from "./components/Loader";

function App() {
  const { role, loading } = useContext(AuthContext);

if (loading) {
  return <Loader fullScreen />;
}
  const roleRoutes = getRoutesByRole(role);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USER", "EMPLOYEE"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {roleRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
