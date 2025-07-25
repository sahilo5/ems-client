// pages/LoginForm.hooks.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};
  const { showToast } = useToast();

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

      let userRole = localStorage.getItem("userRole");
      showToast("Login successfully!", "success")
      
      navigate("/");
    } catch (err: any) {
      newErrors.invalidError = "Invalid username"
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const validate = () => {


    if (!username.trim()) newErrors.usernameError = " ";
    if (!password) newErrors.passwordError = " ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const onLoginSubmit = () => {
    if (validate()) {
      handleLogin();
    }
  };

  return {
    username,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleRegister,
    onLoginSubmit,
    errors
  };
};
