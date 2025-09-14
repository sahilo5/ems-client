import { useState, useEffect } from "react";
import { api } from "../../utils/api";

export type EmployeeDashboardData = {
  fullName: string;
  attendanceCount?: number;
};

export const useEmployeeDashboard = (username: string) => {
  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);

      const [userRes] = await Promise.all([
        api(`/user/fullName/${username}`, { method: "GET" })
      ]);

      setData({
        fullName: userRes.data?.fullName ?? "Employee"
      });
    } catch (err) {
      console.error("Error fetching employee dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [username]);

  return { data, loading, refresh: fetchEmployeeData };
};
