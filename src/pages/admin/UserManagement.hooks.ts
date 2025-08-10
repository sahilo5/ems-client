import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { useToast } from "../../components/ToastProvider";
import { useNavigate } from "react-router-dom";

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [UsersWithRoleData, setUsersWithRoleData] = useState([]);
  const { role, token, username } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);


  const handleGetAllUsers = async () => {
    setLoading(true);
    try {
      const response = await api(`/admin/getAllUsers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        const transformedData = response.data.map((user: any) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phoneNumber: user.phoneNumber,
          username: user.username,
        }));
        setUserData(transformedData);
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUsersWithRoles = async () => {
    setLoading(true);
    try {
      const response = await api(`/admin/getAllUsers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        const transformedData = response.data.map((user: any) => ({
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }));
        setUsersWithRoleData(transformedData);
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api(`/admin/updateUser`, {
        method: "PUT", // or "POST" based on your backend
        body: JSON.stringify(userData),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.success) {
        showToast("User updated successfully", "success");
        handleGetAllUsers();
        setIsOpen(false);
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Error updating user", "error");
    } finally {
      setLoading(false);
    }
  };
  

  const handleBulkDeleteUsers = async (selectedUsers: any[]) => {
    if (!selectedUsers.length) {
      showToast("No users selected for deletion", "error");
      return;
    }

    const usernames = selectedUsers.map(user => user.username);
    console.log(usernames);
    setLoading(true);
    try {
      const response = await api(`/admin/deleteUsers`, {
        method: "POST",
        body: JSON.stringify({ users: usernames }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        showToast("Users deleted successfully", "success");
      } else {
        showToast(response.message, "error");
      }
      setSelectedUsers([]);
    } catch (error) {
      showToast(error, "error");
      setSelectedUsers([]);
    } finally {
      setLoading(false);
    }
    handleGetAllUsers();
    selectedUsers = [];
  };


  const handleConfirm = () => {
    handleBulkDeleteUsers(selectedUsers);
    setIsOpen(false);
  };

  useEffect(() => {
    handleUsersWithRoles();
    handleGetAllUsers();
  }, []);

  const UserColumnHeaders: { header: string; accessor: keyof typeof UserData[0] }[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Username", accessor: "username" },
  ];

  const UserWithRoleColumnHeaders: { header: string; accessor: keyof typeof UserData[0] }[] = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Role", accessor: "role" },
  ];

  return {
    handleGetAllUsers, UserData, UserColumnHeaders, loading, handleUsersWithRoles, UserWithRoleColumnHeaders,
    UsersWithRoleData, navigate, isOpen, setIsOpen, handleConfirm, selectedUsers, handleUpdateUser, setSelectedUsers
  };
};