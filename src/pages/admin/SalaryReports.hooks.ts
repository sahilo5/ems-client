import { useState } from "react";

export type SalaryReport = {
  id: number;
  employeeName: string;
  month: string;
  baseSalary: number;
  deductions: number;
  netSalary: number;
};

export const useSalaryReports = () => {
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API calls and export logic
  const fetchSalaryReports = async () => {
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
  };

  const exportSalaryReport = () => {
    // TODO: Implement export logic
  };

  const SalaryReportColumns: { header: string; accessor: keyof SalaryReport }[] = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Month", accessor: "month" },
    { header: "Base Salary", accessor: "baseSalary" },
    { header: "Deductions", accessor: "deductions" },
    { header: "Net Salary", accessor: "netSalary" },
  ];

  return {
    salaryReports,
    loading,
    fetchSalaryReports,
    exportSalaryReport,
    SalaryReportColumns,
  };
};
