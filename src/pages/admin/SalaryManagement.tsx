import React from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Advances from "./Advances";
import OtherPayments from "./OtherPayments";
import SalaryLogs from "./SalaryLogs";
import SalaryConfig from "./SalaryConfig";
import SalaryPayment from "./SalaryPayment";

const SalaryManagement = () => {
  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        <Tab index={0} label="Payment">
          <SalaryPayment />
        </Tab>
        <Tab index={1} label="Salary Config">
          <SalaryConfig />
        </Tab>
        <Tab index={2} label="Advances">
          <Advances />
        </Tab>
        <Tab index={3} label="Other Payments">
          <OtherPayments />
        </Tab>
        <Tab index={4} label="Logs">
          <SalaryLogs />
        </Tab>
      </Tabs>
    </div>
  );
};

export default SalaryManagement;
