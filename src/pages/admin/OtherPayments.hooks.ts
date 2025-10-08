import { useState } from "react";

export type OtherPayment = {
  id: number;
  employeeName: string;
  amount: number;
  date: string;
  type: string;
  status: string;
};

export const useOtherPayments = () => {
  const [otherPayments, setOtherPayments] = useState<OtherPayment[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API calls
  const fetchOtherPayments = async () => {
    setLoading(true);
    // TODO: Implement API call
    setLoading(false);
  };

  const OtherPaymentColumns: { header: string; accessor: keyof OtherPayment }[] = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
  ];

  return {
    otherPayments,
    loading,
    fetchOtherPayments,
    OtherPaymentColumns,
  };
};
