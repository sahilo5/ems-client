import React, { useState } from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import { CheckCheck, Edit, FileX, Plus, RefreshCcw } from "lucide-react";
import { useUserManagement } from "./UserManagement.hooks";
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
  const [editUserData, setEditUserData] = useState<any>(null);

  // State for Assign Role
  const [openAssignRole, setOpenAssignRole] = useState(false);
  const [assignUserData, setAssignUserData] = useState<any>(null);

  const {
    UserData,
    UserColumnHeaders,
    loading,
    handleGetAllUsers,
    handleUsersWithRoles,
    UserWithRoleColumnHeaders,
    UsersWithRoleData,
    isOpen,
    setIsOpen,
    handleConfirm,
    setSelectedUsers,
  } = useUserManagement();

  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        {/* --- Roles Tab --- */}
        <Tab index={0} label="Roles" onClick={handleUsersWithRoles}>
          <Browse
            title="Roles"
            data={UsersWithRoleData}
            columns={UserWithRoleColumnHeaders}
            selectable={true}
            headerActions={(selectedRows) => (
              <div className="space-x-2">
                <Button
                  variant="tertiary"
                  title="Assign Role"
                  disabled={selectedRows.length !== 1}
                  onClick={
                    () => {
                      setAssignUserData(selectedRows[0]);
                      setOpenAssignRole(true);
                    }
                  }
                >
                  <span><CheckCheck className="size-5" /></span>
                </Button>
                <Button variant="tertiary" title="Refresh" onClick={handleUsersWithRoles}>
                  <span><RefreshCcw className="size-5" /></span>
                </Button>
              </div>
            )}
          />
          {loading && (
            <div className="flex items-center justify-center bg-light">
              <Loader size={48} color="text-primary" />
            </div>
          )}
        </Tab>

        {/* --- Users Tab --- */}
        <Tab index={1} label="Users" onClick={handleGetAllUsers}>
          <Browse
            title="Users"
            data={UserData}
            columns={UserColumnHeaders}
            selectable={true}
            headerActions={(selectedRows) => (
              <div className="space-x-2">
                {/* Edit Button */}
                <Button
                  variant="tertiary"
                  title="Edit"
                  disabled={selectedRows.length !== 1}
                  onClick={() => {
                    setEditUserData(selectedRows[0]);
                    setOpenEdit(true);
                  }}
                >
                  <span><Edit className="size-5" /></span>
                </Button>

                {/* Add Button */}
                <Button
                  variant="tertiary"
                  title="Add"
                  onClick={() => setOpenAdd(true)}
                >
                  <span><Plus className="size-5" /></span>
                </Button>

                {/* Delete Button */}
                <Button
                  variant="tertiary"
                  title="Delete"
                  disabled={selectedRows.length < 1}
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedUsers(selectedRows);
                  }}
                >
                  <span><FileX className="size-5" /></span>
                </Button>

                {/* Refresh Button */}
                <Button
                  variant="tertiary"
                  title="Refresh"
                  onClick={handleGetAllUsers}
                >
                  <span><RefreshCcw className="size-5" /></span>
                </Button>
              </div>
            )}
          />
          {loading && (
            <div className="flex items-center justify-center bg-light">
              <Loader size={48} color="text-primary" />
            </div>
          )}
        </Tab>
      </Tabs>

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
