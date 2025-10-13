import React, { useState } from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Loader from "../../components/Loader";
import { useAttendanceManagement } from "./AttendanceManagement.hooks";
import ShowQrCode from "./ShowQrCode";
import MarkAttendance from "./MarkAttendance";

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
              <div className="flex items-center justify-center bg-light/10">
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
              <div className="flex items-center justify-center bg-light/10">
                <Loader size={48} color="text-primary" />
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
