// src/pages/LeaveManagement/LeaveManagement.hooks.ts
import { useEffect, useState, useCallback } from "react";
import { api } from "../../utils/api";

export interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export const useLeaveManagement = () => {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch leave requests from API
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api("/leaves", { method: "GET" });
      const data = await response.json();
      setLeaves(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  }, []);

  // trigger refresh
  const refresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves, refreshKey]);

  return {
    loading,
    leaves,
    error,
    refresh,
  };
};
