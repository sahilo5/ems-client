import { useState } from "react";

export type ExpenseReport = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

export const useExpensesReports = () => {
  const [expensesReports, setExpensesReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API calls and export logic
  const fetchExpensesReports = async () => {
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
  };

  const exportExpensesReport = () => {
    // TODO: Implement export logic
  };

  const ExpenseReportColumns: { header: string; accessor: keyof ExpenseReport }[] = [
    { header: "Category", accessor: "category" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description" },
  ];

  return {
    expensesReports,
    loading,
    fetchExpensesReports,
    exportExpensesReport,
    ExpenseReportColumns,
  };
};
