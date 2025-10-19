import React, { useEffect } from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { useAssignRole } from "./AssignRole.hooks";
import Badge from "../../components/Badge";

type AssignRoleProps = {
  userData: any;       
  onClose: () => void; 
};

const AssignRole: React.FC<AssignRoleProps> = ({ userData, onClose }) => {
  const {
    currentRole,
    rolesList,
    selectedRole,
    setSelectedRole,
    fetchRoles,
    fetchCurrentRole,
    onSubmit,
    loading,
  } = useAssignRole(userData, onClose);

  useEffect(() => {
    fetchRoles();
    fetchCurrentRole();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-dark">
        Assign Role
      </h2>

      <p className="mb-2 text-sm text-gray-600">
        <strong>Current Role : </strong> <Badge  text={currentRole || "No role assigned"} variant="info" />
      </p>

      <Form
        fields={[
          {
            type: "dropdown",
            name: "role",
            label: "Select New Role",
            value: selectedRole,
            onChange: setSelectedRole,
            options: rolesList.map((role) => ({
              value: role,
              label: role,
            })),
          }
        ]}
      />

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AssignRole;
