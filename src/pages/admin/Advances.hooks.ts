import { useState } from "react";

export type Advance = {
  id: number;
  employeeName: string;
  amount: number;
  date: string;
  status: string;
};

export const useAdvances = () => {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API calls
  const fetchAdvances = async () => {
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
  };

  const AdvanceColumns: { header: string; accessor: keyof Advance }[] = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
  ];

  return {
    advances,
    loading,
    fetchAdvances,
    AdvanceColumns,
  };
};
