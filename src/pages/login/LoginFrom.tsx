// pages/LoginForm.tsx
import React from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { useLoginForm } from "./LoginFrom.hooks";
import { COMPANY_NAME } from "../../constants";

const LoginForm = () => {
  const {
    username,
    setEmail,
    password,
    setPassword,
    handleRegister,
    onLoginSubmit,
    errors
  } = useLoginForm();

  return (
    <div className="max-w-md w-full bg-light shadow-lg p-8 rounded-2xl border border-light">
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLoginSubmit();
        }}
>
      <Form
        fields={[
          {
            type: "text",
            name: "text",
            label: "Username",
            value: username,
            onChange: setEmail,
            placeholder: "Enter your username",
            error: errors.usernameError,
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            value: password,
            onChange: setPassword,
            placeholder: "Enter your password",
            error: errors.passwordError,
          },
        ]}
      />

      <div className="text-sm text-red-500 p-2">{errors.invalidError}</div>

      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" type="submit" className="w-full">
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
      <div className="mt-6 text-center text-sm text-muted">
  &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">{COMPANY_NAME}</span>. All rights reserved.
</div>  
      </form>
    </div>
  );
};

export default LoginForm;
