import React, { useState } from "react";
import { Tabs, Tab } from "../../components/Tabs";
import { QrCode, CalendarCheck, Settings, RefreshCcw } from "lucide-react";
import Loader from "../../components/Loader";
import { useAttendanceManagement } from "./AttendanceManagement.hooks";
import ShowQrCode from "./ShowQrCode";
import MarkAttendance from "./MarkAttendance";
import AdminLeaveManagement from "./AdminLeaveManagement";

const AttendanceManagement = () => {
  const {
    loading,
  } = useAttendanceManagement();

  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        {/* --- Show QR Tab --- */}
        <Tab index={0} label="Show QR" >
          <div className="flex flex-col space-y-4">
          <ShowQrCode/>
            {loading && (
              <div className="flex items-center justify-center bg-light">
                <Loader size={48} color="text-primary" />
              </div>
            )}
          </div>
        </Tab>

        {/* --- Mark Attendance Tab --- */}
        <Tab index={1} label="Manage Attendance">
          <div className="flex flex-col space-y-4">
            <MarkAttendance/>
            
            {loading && (
              <div className="flex items-center justify-center bg-light">
                <Loader size={48} color="text-primary" />
              </div>
            )}
          </div>
        </Tab>

        {/* --- Manage Leave Tab --- */}
        <Tab index={2} label="Manage Leave">
          <div className="flex flex-col space-y-4">
            <AdminLeaveManagement/>
            
            {loading && (
              <div className="flex items-center justify-center bg-light">
                <Loader size={48} color="text-primary" />
              </div>
            )}
          </div>
        </Tab>

        {/* --- Settings Tab --- */}
        <Tab index={3} label="Settings">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="size-5" /> <span>Attendance Settings</span>
            </h2>
            <p className="text-sm text-gray-600">Settings will be configured here.</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
