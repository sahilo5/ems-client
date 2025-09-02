import React, { useContext, useState } from "react";
import { CalendarCheck, DollarSign, Users } from "lucide-react";
import Card from "../components/Card";
import { AuthContext } from "../context/AuthContext";
import ShowQrCode from "./admin/ShowQrCode";
import ScanQrForAttendance from "./employee/scanQrForAttendance";

const Dashboard: React.FC = () => {
  const { role } = useContext(AuthContext);
  const [showScanner, setShowScanner] = useState(false);
  
  return (
    <div className="p-6">
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-light">
          <Card
            title="Total Employees"
            value="124"
            icon={<Users className="w-5 h-5" />}
          />
          <Card
            title="Attendance Today"
            value="97"
            icon={<CalendarCheck className="w-5 h-5" />}
            footer="As of 10:00 AM"
          />
          <Card
            title="Total Payroll"
            value="$89,200"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>
      )}

      {role === "USER" && (
        <div>
          {/* User-specific dashboard components go here */}
          <h2 className="text-lg font-semibold">Welcome User!</h2>
        </div>
      )}

      {role === "EMPLOYEE" && (
        <div>
        <button
          onClick={() => setShowScanner(true)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition"
        >
          Scan Attendance QR
        </button>
  
        {/* Show scanner only when button is clicked */}
        {showScanner && (
          <div className="mt-6">
            <ScanQrForAttendance onClose={() => setShowScanner(false)} />
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Dashboard;
