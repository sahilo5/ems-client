import { useContext, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export type AttendanceSummary = {
  date: string;
  present: number;
  absent: number;
};

export type AdminDashboardData = {
  totalEmployees: number;
  totalUsers: number;
  todayAttendance: number;
  payroll: number;
  attendanceSummary: AttendanceSummary[];
};

export const useAdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 📅 Calculate last one month range
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const formatDate = (d: Date) => d.toISOString().split("T")[0];
      const startDate = formatDate(lastMonth);
      const endDate = formatDate(today);

      // 1️⃣ Fetch employees & users
      const [employeesRes, usersRes] = await Promise.all([
        api("/admin/getAllEmployees", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
        api("/admin/getAllUsers", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const employees = employeesRes.data;
      const users = usersRes.data;

      // 2️⃣ For each employee, fetch attendance summary
      const attendanceResponses = await Promise.all(
        employees.map((emp: any) =>
          api("/admin/attendance/summary", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: emp.username,
              startDate,
              endDate,
            }),
          })
        )
      );

      const allSummaries = attendanceResponses.flatMap(
        (res: any) => res.data ?? []
      );

      // 3️⃣ Group by date and count present/absent
      const summaryByDate: Record<string, { present: number; absent: number }> = {};

      allSummaries.forEach((s: any) => {
        if (!summaryByDate[s.date]) {
          summaryByDate[s.date] = { present: 0, absent: 0 };
        }

        if (s.status === "PRESENT" || s.status === "HALF_DAY") {
          summaryByDate[s.date].present += 1;
        } 
        summaryByDate[s.date].absent =  employees.length -summaryByDate[s.date].present;
      });

      // Convert grouped object → array for recharts
      const attendanceSummary: AttendanceSummary[] = Object.entries(summaryByDate).map(
        ([date, { present, absent }]) => ({
          date,
          present,
          absent,
        })
      );

      // 4️⃣ Count today’s attendance
      const todayStr = today.toISOString().split("T")[0];
      const todayAttendance = summaryByDate[todayStr]?.present ?? 0;

      setData({
        totalEmployees: employees.length,
        totalUsers: users.length,
        todayAttendance,
        payroll: 0,
        attendanceSummary,
      });

    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, loading, refresh: fetchDashboardData };
};
