// pages/LoginForm.tsx
import React from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { useLoginForm } from "./LoginFrom.hooks";

const LoginForm = () => {
  const {
    username,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleRegister,
  } = useLoginForm();

  return (
    <div className="max-w-md w-full bg-light shadow-lg p-8 rounded-2xl border border-light">
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Login</h2>

      <Form
        fields={[
          {
            type: "text",
            name: "text",
            label: "Username",
            value: username,
            onChange: setEmail,
            placeholder: "Enter your username",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            value: password,
            onChange: setPassword,
            placeholder: "Enter your password",
          },
        ]}
      />

      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={handleLogin} className="w-full">
          Login
        </Button>
        <Button variant="secondary" onClick={handleRegister} className="w-full">
          Register
        </Button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-primary hover:underline transition duration-150"
          onClick={() => console.log("Forgot Password clicked")}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
