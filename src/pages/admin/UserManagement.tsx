import React, { useState } from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import { CheckCheck, Edit, FileX, Plus, RefreshCcw } from "lucide-react";
import { useUserManagement, User } from "./UserManagement.hooks";
import Loader from "../../components/Loader";
import MiniWindow from "../../components/MiniWindow";
import EditUser from "./EditUser";
import Popup from "../../components/Popup";
import AddUser from "./AddNewUser";
import AssignRole from "./AssignRole";

const UserManagement = () => {
  // For Add New User
  const [openAdd, setOpenAdd] = useState(false);

  // For Edit User
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);

  // State for Assign Role
  const [openAssignRole, setOpenAssignRole] = useState(false);
  const [assignUserData, setAssignUserData] = useState<User | null>(null);

  const {
    loading,
    userData,
    columnHeaders,
    getUsers,
    isOpen,
    setIsOpen,
    handleConfirm,
    setSelectedUsers,
  } = useUserManagement();

  return (
    <div className="space-y-2">
      <Browse
        title="Users"
        data={userData}
        columns={columnHeaders}
        rowActions={(row) => (
          <div className="flex gap-2">
            {/* Edit */}
            <Button
              variant="refresh"
              title="Edit"
              onClick={() => {
                setEditUserData(row);
                setOpenEdit(true);
              }}
            >
              <Edit className="size-4" />
            </Button>

            {/* Assign Role */}
            <Button
              variant="safe"
              title="Assign Role"
              disabled= {row.roles[0] === "ADMIN"}
              onClick={() => {
                setAssignUserData(row);
                setOpenAssignRole(true);
              }}
            >
              <CheckCheck className="size-4" />
            </Button>

            {/* Delete */}
            <Button
              variant="danger"
              title="Delete"
              disabled= {row.roles[0] === "ADMIN"}
              onClick={() => {
                setIsOpen(true);
                setSelectedUsers([row]);
              }}
            >
              <FileX className="size-4" />
            </Button>
          </div>
        )}
        headerActions={
          <div className="space-x-2">
            {/* Add */}
            <Button variant="tertiary" title="Add" onClick={() => setOpenAdd(true)}>
              <Plus className="size-5" />
            </Button>

            {/* Refresh */}
            <Button variant="tertiary" title="Refresh" onClick={getUsers}>
              <RefreshCcw className="size-5" />
            </Button>
          </div>
        }
      />

      {loading && (
        <Loader fullScreen></Loader>
      )}

      {/* Add New User Window */}
      <MiniWindow isOpen={openAdd} onClose={() => setOpenAdd(false)} size="small">
        <AddUser onClose={() => setOpenAdd(false)} />
      </MiniWindow>

      {/* Edit User Window */}
      <MiniWindow isOpen={openEdit} onClose={() => setOpenEdit(false)} size="small">
        {editUserData && (
          <EditUser userData={editUserData} onClose={() => setOpenEdit(false)} />
        )}
      </MiniWindow>

      {/* Assign Role Window */}
      <MiniWindow isOpen={openAssignRole} onClose={() => setOpenAssignRole(false)} size="small">
        {assignUserData && (
          <AssignRole
            userData={assignUserData}
            onClose={() => setOpenAssignRole(false)}
          />
        )}
      </MiniWindow>


      {/* Delete Confirmation Popup */}
      <Popup
        title="Confirm"
        content="Are you sure you want to Delete these Users? This action cannot be undone."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
        variant="confirm"
      />
    </div>
  );
};

export default UserManagement;
