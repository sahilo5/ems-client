import React from "react";
import Loader from "../../components/Loader";
import { Tabs, Tab } from "../../components/Tabs";
import { useLeaveManagement } from "./LeaveManagement.hooks";
import EmployeeLeaveManagement from "./EmployeeLeaveManagement";

const LeaveManagement = () => {
    const { loading, leaves, error, refresh } = useLeaveManagement();
  
    return (
      <div className="space-y-2">
        <Tabs defaultIndex={0}>
          {/* --- Apply Leave Tab --- */}
          <Tab index={0} label="Apply Leave">
            <div className="flex flex-col space-y-4">
                <EmployeeLeaveManagement/>
              {loading && (
                <div className="flex items-center justify-center bg-light">
                  <Loader size={48} color="text-primary" />
                </div>
              )}
            </div>
          </Tab>
  
        </Tabs>
      </div>
    );
  };
  
  export default LeaveManagement;