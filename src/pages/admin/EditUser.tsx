import React, { useEffect } from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { useEditUser } from "./EditUser.hooks";

type EditUserProps = {
  userData: any;       
  onClose: () => void; 
};

const EditUser: React.FC<EditUserProps> = ({ userData, onClose }) => {
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
    onSubmit,
    errors,
    loadUserData
  } = useEditUser(onClose);

  // Load data into form on mount
  useEffect(() => {
    if (userData) {
      loadUserData(userData);
    }
  }, [userData]);

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">
        Edit User
      </h2>

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
            disabled:true
          },
        ]}
      />

      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={onSubmit} className="w-full">
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default EditUser;
