import { useState } from 'react'
import './App.css'
import React from 'react'
import LoginForm from './pages/login/LoginFrom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import RegisterForm from './pages/register/RegisterForm'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />}>
          <Route index element={<Dashboard />} />
          <Route path="registerPage" element={<RegisterForm />} /> {/* testing UI */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
