import React from "react";
import Form from "../../components/Form";
import { useAddNewUser } from "./AddNewUser.hooks";
import Button from "../../components/Button";

type AddUserProps = {      
  onClose: () => void; 
};

const AddUser: React.FC<AddUserProps> = ({  onClose }) => {
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
    onSubmit,
    errors,
    
  } = useAddNewUser(onClose);

  return (
    <>
      
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Add New User</h2>

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
          }
        ]}
      />

      {/* Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={onSubmit} className="w-full">
          Add
        </Button>
      </div>
      </>
  );
};

export default AddUser;
