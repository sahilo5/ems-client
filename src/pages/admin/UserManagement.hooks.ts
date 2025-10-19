import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { useToast } from "../../components/ToastProvider";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  roles: string[];
};

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        api(`/admin/getAllUsers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        api(`/admin/getAllUsersWithRoles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (usersResponse.success && rolesResponse.success) {
        const usersData = usersResponse.data;
        const rolesData = rolesResponse.data;

        const rolesMap = new Map(
          rolesData.map((user: { username: string; roles: string[] }) => [
            user.username,
            user.roles || [],
          ])
        );

        const mergedData: User[] = usersData.map(
          (user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            username: string;
          }) => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
            roles: rolesMap.get(user.username) || [],
          })
        );

        setUserData(mergedData);
      } else {
        if (!usersResponse.success || !rolesResponse.success) showToast(usersResponse.message, "error");
      }
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Record<string, unknown>) => {
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
        getUsers();
        setIsOpen(false);
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };


  const handleBulkDeleteUsers = async (selectedUsers: { username: string }[]) => {
    if (!selectedUsers.length) {
      showToast("No users selected for deletion", "error");
      return;
    }

    const usernames = selectedUsers.map(user => user.username);
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
      showToast((error as Error).message, "error");
      setSelectedUsers([]);
    } finally {
      setLoading(false);
    }
    getUsers();
    selectedUsers = [];
  };


  const handleConfirm = () => {
    handleBulkDeleteUsers(selectedUsers);
    setIsOpen(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columnHeaders: { header: string; accessor: keyof User }[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Username", accessor: "username" },
    { header: "Roles", accessor: "roles" },
  ];

  return {
    loading,
    userData,
    columnHeaders,
    getUsers,
    isOpen,
    setIsOpen,
    handleConfirm,
    selectedUsers,
    setSelectedUsers,
    handleUpdateUser,
  };
};