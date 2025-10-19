import { useContext, useState } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { useUserManagement } from "./UserManagement.hooks"; 
import { AuthContext } from "../../context/AuthContext";

export const useAssignRole = (userData: any, onClose: () => void) => {
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);
  const { showToast } = useToast();
  const { handleConfirm } = useUserManagement();

  
  /** Fetch all available roles */
  const fetchRoles = async () => {
    try {
      const res = await api("/admin/getRoles", { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setRolesList(res.data || []);
    } catch (err) {
      showToast("Failed to load roles", "error");
    }
    
  };

  /** Fetch current user role(s) */
  const fetchCurrentRole = async () => {
    try {
      const res = await api(`/admin/getUserRoles/${userData.username}`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        setCurrentRole(res.data[0]); 
      }
    } catch (err) {
      showToast("Failed to fetch current role", "error");
    }
  };

  /** Update user role */
  const onSubmit = async () => {
    if (!selectedRole) {
      showToast("Please select a role", "error");
      return;
    }

    setLoading(true);
    try {
      await api(`/admin/updateUserRole/${userData.username}/${selectedRole}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      showToast("Role updated successfully", "success");
      onClose();
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    currentRole,
    rolesList,
    selectedRole,
    setSelectedRole,
    fetchRoles,
    fetchCurrentRole,
    onSubmit,
    loading,
  };
};
