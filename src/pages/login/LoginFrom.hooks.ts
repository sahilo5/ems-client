// pages/LoginForm.hooks.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api"; // path to your API utility

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // To store token,userName, userRole
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("userName", response.username);
      localStorage.setItem("userRole", response.urserRole);
      
      navigate("/Dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return {
    username,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleRegister,
  };
};
