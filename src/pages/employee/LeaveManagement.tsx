import React from "react";
import Loader from "../../components/Loader";
import { Tabs, Tab } from "../../components/Tabs";
import { useLeaveManagement } from "./LeaveManagement.hooks";
import EmployeeLeaveManagement from "./EmployeeLeaveManagement";

const LeaveManagement = () => {
    const { loading, leaves, error, refresh } = useLeaveManagement();
  
    return (
      <div className="space-y-2">
        
                <EmployeeLeaveManagement/>
              {loading && (
                <div className="flex items-center justify-center bg-light">
                  <Loader size={48} color="text-primary" />
                </div>
              )}
            
      </div>
    );
  };
  
  export default LeaveManagement;