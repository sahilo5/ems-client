import { useState } from "react";

export type LedgerReport = {
  id: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export const useLedgerReports = () => {
  const [ledgerReports, setLedgerReports] = useState<LedgerReport[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API calls and export logic
  const fetchLedgerReports = async () => {
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
  };

  const exportLedgerReport = () => {
    // TODO: Implement export logic
  };

  const LedgerReportColumns: { header: string; accessor: keyof LedgerReport }[] = [
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description" },
    { header: "Debit", accessor: "debit" },
    { header: "Credit", accessor: "credit" },
    { header: "Balance", accessor: "balance" },
  ];

  return {
    ledgerReports,
    loading,
    fetchLedgerReports,
    exportLedgerReport,
    LedgerReportColumns,
  };
};
