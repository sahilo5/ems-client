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
  employeeName: string; // include employee info
  rejectionMsg?: string;
};

export const useAdminLeaveManagement = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  // Get all leaves
  const handleGetAllLeaves = async () => {
    setLoading(true);
    try {
      const response = await api(`/admin/leave/all`, {
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

  // Approve / Reject leave
  const handleUpdateLeaveStatus = async (
    leaveId: number,
    status: "APPROVED" | "REJECTED",
    rejectionMsg?: string
  ) => {
    setPopupOpen(true);
    setLoading(true);
    try {
      const response = await api(`/admin/leave/status/${leaveId}`, {
        method: "POST",
        body: JSON.stringify({ status, rejectionMsg }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        showToast(`Leave ${status.toLowerCase()} successfully`, "success");
        handleGetAllLeaves();
        setIsOpenReject(false);
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
    handleGetAllLeaves();
  }, []);

  const LeaveColumnHeaders: { header: string; accessor: keyof Leave }[] = [
    { header: "Employee", accessor: "employeeName" },
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
    selectedLeave,
    setSelectedLeave,
    isOpenReject,
    setIsOpenReject,
    handleGetAllLeaves,
    handleUpdateLeaveStatus,popupOpen, setPopupOpen
  };
};
