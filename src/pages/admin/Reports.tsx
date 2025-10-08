import React from "react";
import { Tabs, Tab } from "../../components/Tabs";
import AttendanceReports from "./AttendanceReports";
import ExpensesReports from "./ExpensesReports";
import SalaryReports from "./SalaryReports";
import LedgerReports from "./LedgerReports";

const Reports: React.FC = () => {
  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        <Tab index={0} label="Attendance">
          <AttendanceReports />
        </Tab>
        <Tab index={1} label="Expenses">
          <ExpensesReports />
        </Tab>
        <Tab index={2} label="Salary">
          <SalaryReports />
        </Tab>
        <Tab index={3} label="Ledger">
          <LedgerReports />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Reports;
