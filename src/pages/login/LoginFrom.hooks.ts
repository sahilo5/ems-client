// pages/LoginForm.hooks.ts
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { AuthContext } from "../../context/AuthContext";


export const useLoginForm = () => {
  const navigate = useNavigate();
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  // Miniwindow
  const [open, setOpen] = useState(false);
  const { setAuth } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setAuth({
        token:  response.accessToken,
        role:  response.userRole,
        username: response.username,
      });
      showToast("Login successfully!", "success")
      
      navigate("/");
    } catch (err: any) {
      const serverErrors: { [key: string]: string } = {};
    
      if (err.message === "Invalid username or password") {
        serverErrors.passwordError = "Invalid username or password !";
        serverErrors.usernameError = " ";
      } else if (err.message) {
        serverErrors.passwordError = err.message;
      } else {
        serverErrors.passwordError = "Server error. Please try again later !";
      }
    
      setErrors(prev => ({ ...prev, ...serverErrors }));
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

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
    errors,
    open,
    setOpen
  };
};
