// pages/RegisterForm.tsx
import React, { useState } from "react";
import Form from "../../components/Form";
import { useRegisterForm } from "./RegisterForm.hooks";
import Button from "../../components/Button";

const RegisterForm = () => {
  const {
    email,
    password,
    dob,
    agree,
    gender,
    handleRegister,
    setEmail,
    setPassword,
    setDob,
    setAgree,
    setGender,
    handleLogin
  } = useRegisterForm();

  return (
    <div className="max-w-md w-full bg-light shadow-lg p-8 rounded-2xl border border-light">
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Register</h2>
      <Form
        fields={[
          {
            type: "email",
            name: "email",
            label: "Email",
            value: email,
            onChange: setEmail,
            placeholder: "Your email",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            value: password,
            onChange: setPassword,
            placeholder: "Choose a password",
          },
          {
            type: "date",
            name: "dob",
            label: "Date of Birth",
            value: dob,
            onChange: setDob,
          },
          {
            type: "dropdown",
            name: "gender",
            label: "Gender",
            value: gender,
            onChange: setGender,
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ],
          },
          {
            type: "checkbox",
            name: "agree",
            label: "I agree to the terms",
            checked: agree,
            onChange: setAgree,
          },
        ]}
      />
      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={handleRegister} className="w-full">
          Register
        </Button>
        <Button variant="secondary" onClick={handleLogin} className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
