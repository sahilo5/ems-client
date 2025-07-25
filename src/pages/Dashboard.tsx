import React from "react";
import { NavItem } from "../components/Sidebar";
import {CalendarCheck, DollarSign, Users} from "lucide-react";
import Card from "../components/Card";

const userRole = localStorage.getItem("userRole");

const Dashboard: React.FC  = () => {

  
  return (

    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-light">
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
  );
};

export default Dashboard;
