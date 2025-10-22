import { useState } from "react";
import ScanQrForAttendance from "../../pages/employee/scanQrForAttendance";
import React from "react";
import { useEmployeeDashboard } from "./EmployeeDashboard.hooks";
import Loader from "../../components/Loader";

type Props = { username: string };

const EmployeeDashboard: React.FC<Props> = ({ username }) => {
  const { data, loading } = useEmployeeDashboard(username);
  const [showScanner, setShowScanner] = useState(false);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="relative min-h-screen">
      {!showScanner ? (
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">
            Welcome, {data?.fullName ?? "Employee"} 👋
          </h2>

          <button
            onClick={() => setShowScanner(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition"
          >
            Scan Attendance QR
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 z-50 bg-white">
          <ScanQrForAttendance onClose={() => setShowScanner(false)} />
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
