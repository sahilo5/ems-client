import React from "react";
import Form from "../../components/Form";
import { useRegisterForm } from "./RegisterForm.hooks";
import Button from "../../components/Button";

const RegisterForm = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agree,
    setAgree,
    handleLogin,
    onSubmit,
    errors
  } = useRegisterForm();

  return (
    <div className="max-w-md w-full backdrop-blur-lg bg-white/30 text-dark shadow-inner shadow-white/20 p-6 rounded-2xl border border-light">
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Register</h2>

      {/* Rest of the Form */}
      <Form
        className="mt-4"
        fields={[

          {
            group: true,
            fields: [
              {
                type: "text",
                name: "firstName",
                label: "First Name",
                value: firstName,
                onChange: setFirstName,
                error: errors.firstNameError,
                placeholder: "First Name",
              },
              {
                type: "text",
                name: "lastName",
                label: "Last Name",
                value: lastName,
                onChange: setLastName,
                error: errors.lastNameError,
                placeholder: "Last Name",
              },
            ],
          },
          {
            type: "email",
            name: "email",
            label: "Email",
            value: email,
            onChange: setEmail,
            placeholder: "Your email",
            error: errors.emailError, 
          },
          {
            type: "number",
            name: "phoneNumber",
            label: "Phone Number",
            value: phoneNumber,
            onChange: setPhoneNumber,
            placeholder: "Your Phone Number",
            error: errors.phoneNumberError,
          },
          {
            type: "text",
            name: "username",
            label: "Username",
            value: username,
            onChange: setUsername,
            error: errors.usernameError,
            placeholder: "Username",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            value: password,
            onChange: setPassword,
            placeholder: "Choose a password",
            error: errors.passwordError,
          },
          {
            type: "password",
            name: "confirmPassword",
            label: "Confirm Password",
            value: confirmPassword,
            onChange: setConfirmPassword,
            placeholder: "Confirm a password",
            error: errors.confirmPasswordError,
          },
          {
            type: "checkbox",
            name: "agree",
            label: "I agree to the terms",
            checked: agree,
            onChange: setAgree,
            error: errors.agreeError,
          },
        ]}
      />

      {/* Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={onSubmit} className="w-full">
          Register
        </Button>
        <Button variant="secondary" onClick={handleLogin} className="w-full">
          Login
        </Button>
      </div>
      <div className="mt-6 text-center text-sm text-muted">
  {/* &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">{COMPANY_NAME}</span>. All rights reserved. */}
</div>
    </div>
  );
};

export default RegisterForm;
