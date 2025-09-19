import { useContext, useState } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { useUserManagement } from "./UserManagement.hooks";
import { AuthContext } from "../../context/AuthContext";

export const useEditUser = (onClose: () => void) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const loadUserData = (user: any) => {
    setFirstName(user.name?.split(" ")[0] || "");
    setLastName(user.name?.split(" ")[1] || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber?.toString() || "");
    setUsername(user.username || "");
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPhoneNumber("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstNameError = " ";
    if (!lastName.trim()) newErrors.lastNameError = " ";

    if (!email.trim()) newErrors.emailError = " ";
    else if (!email.includes("@") || !email.includes(".")) newErrors.emailError = "Enter a valid email.";

    if (!phoneNumber.trim()) newErrors.phoneNumberError = " ";
    else if (!phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumberError = "Phone number must be exactly 10 digits.";

    if (!username) newErrors.usernameError = " ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
    };

    try {
      const response = await api(`/user/updateUser/${username}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      showToast(response.message || "User updated successfully", "success");
      onClose();
      resetForm();
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

  const onSubmit = () => {
    if (validate()) {
      handleSubmit();
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
    onSubmit,
    errors,
    loadUserData,
  };
};
