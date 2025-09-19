import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegister = async () => {
    try {
      const response = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, username, password, confirmPassword, agree }),
      });
      showToast(response.message, "success");
      navigate("/login");
      
    } catch (err: any) {
      const serverErrors: { [key: string]: string } = {};
      if (err.message === "Username already exists") {
        serverErrors.usernameError = "Username already exists !";
      } else {
        showToast(err.message,"error");
      }
      setErrors(prev => ({ ...prev, ...serverErrors }));
   
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };


  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const validate = () => {

    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstNameError = " ";
    if (!lastName.trim()) newErrors.lastNameError = " ";

    if (!email.trim()) newErrors.emailError = " ";
    else if (!email.includes("@") || !email.includes(".")) newErrors.emailError = "Enter a valid email.";

    if (!phoneNumber.trim()) newErrors.phoneNumberError = " ";
    else if (!phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumberError = "Phone number must be exactly 10 digits.";

    if (!username) newErrors.usernameError = " ";

    if (!password) newErrors.passwordError = " ";

    if (!confirmPassword) newErrors.confirmPasswordError = " ";
    else if (confirmPassword !== password || !confirmPassword) newErrors.confirmPasswordError = "Passwords do not match.";

    if (!agree) newErrors.agreeError = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const onSubmit = () => {
    if (validate()) {
      handleRegister();
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agree,
    setAgree,
    handleRegister,
    handleLogin,
    onSubmit,
    errors
  };
}
