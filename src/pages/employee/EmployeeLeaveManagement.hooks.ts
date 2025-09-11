import { useState, useContext, useEffect } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type Leave = {
  id: number;
  type: string;
  reason: string;
  dates: string[];
  description: string;
  status: string;
  createdAt: string;
};

export const useEmployeeLeaveManagement = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  // Fetch all leaves of logged-in employee
  const handleGetMyLeaves = async () => {
    setLoading(true);
    try {
      const response = await api(`/user/leave/my-leaves`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        setLeaves(response.data || []);
      } else {
        showToast(response.message, "error");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Apply leave
  const handleApplyLeave = async (leaveData: Omit<Leave, "id" | "status" | "createdAt">) => {
    setLoading(true);
    try {
      const response = await api(`/user/leave/apply`, {
        method: "POST",
        body: JSON.stringify(leaveData),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        showToast("Leave applied successfully", "success");
        handleGetMyLeaves();
        return true;
      } else {
        showToast(response.message, "error");
        return false;
      }
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update leave (only pending)
  const handleUpdateLeave = async (leaveData: Leave) => {
    if (leaveData.status !== "PENDING") {
      showToast("Only pending leaves can be edited", "error");
      return false;
    }

    setLoading(true);
    try {
      const response = await api(`/user/leave/update/${leaveData.id}`, {
        method: "PUT",
        body: JSON.stringify(leaveData),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        showToast("Leave updated successfully", "success");
        handleGetMyLeaves();
        setIsOpen(false);
        return true;
      } else {
        showToast(response.message, "error");
        return false;
      }
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete leave (only pending)
  const handleDeleteLeave = async (leaveId: number, status: string) => {
    if (status !== "PENDING") {
      showToast("Only pending leaves can be deleted", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api(`/user/leave/delete/${leaveId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        showToast("Leave deleted successfully", "success");
        handleGetMyLeaves();
      } else {
        showToast(response.message, "error");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMyLeaves();
  }, []);

  const LeaveColumnHeaders: { header: string; accessor: keyof Leave }[] = [
    { header: "Type", accessor: "type" },
    { header: "Reason", accessor: "reason" },
    { header: "Dates", accessor: "dates" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Applied On", accessor: "createdAt" },
  ];

  return {
    leaves,
    LeaveColumnHeaders,
    loading,
    isOpen,
    setIsOpen,
    selectedLeave,
    setSelectedLeave,
    handleGetMyLeaves,
    handleApplyLeave,
    handleUpdateLeave,
    handleDeleteLeave,
  };
};
