import { CalendarCheck, Users } from "lucide-react";
import Loader from "../../components/Loader";
import React from "react";
import { useAdminDashboard } from "./AdminDashboard.hooks";
import Card from "../../components/Card";
import { AttendanceChart } from "../../components/AttendanceChart";

const AdminDashboard: React.FC = () => {
  const { data, loading } = useAdminDashboard();

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-mid-gray hover:text-dark ">
        <Card title="Total Employees" value={data?.totalEmployees ?? "-"} icon={<Users />} />
        <Card title="Total Users" value={data?.totalUsers ?? "-"} icon={<Users />} />
        <Card title="Attendance Today" value={data?.todayAttendance ?? "-"} icon={<CalendarCheck />} />
        {/* <Card title="Total Payroll" value={`$${data?.payroll ?? 0}`} icon={<DollarSign />} /> */}
      </div>

      {/* Attendance Analytics */}
      <div className="backdrop-blur-lg bg-white/40 border border-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Attendance Analytics</h2>
        <AttendanceChart data={data?.attendanceSummary ?? []} />
      </div>
    </div>
  );
};

export default AdminDashboard;
