import { useState } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { useUserManagement } from "./UserManagement.hooks";

export const useAddNewUser = (onClose: () => void) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();


  const handleRegister = async () => {
    try {
      const response = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, username, password, confirmPassword }),
      });

      showToast(response.message, "success");
      onClose();
    } catch (err: any) {
      const serverErrors: { [key: string]: string } = {};
      if (err.message === "Username already exists") {
        serverErrors.usernameError = "Username already exists !";
      } else {
        showToast(err.message,"error");
      }
      setErrors(prev => ({ ...prev, ...serverErrors }));
    }
    setOpen(false);
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
    handleRegister,
    onSubmit,
    errors,
    setOpen,
    open,
  };
}
