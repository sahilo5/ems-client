import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type OtherPayment = {
  id: number;
  type: string;
  remark: string;
  amount: number;
  createdAt: string;
  status: string;
  username: string;
  employeeName: string;
  date: string;
};

export const useOtherPayments = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [otherPayments, setOtherPayments] = useState<OtherPayment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOtherPayments = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/other-payments", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.success) setOtherPayments(res.data);
      else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const addOtherPayment = async (paymentData: Omit<OtherPayment, "id" | "employeeName" | "createdAt" | "status">) => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/other-payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      if (res.success) {
        showToast("Payment added successfully", "success");
        fetchOtherPayments();
      } else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateOtherPayment = async (paymentData: OtherPayment) => {
    setLoading(true);
    try {
      const res = await api(`/admin/salary/other-payments/${paymentData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      if (res.success) {
        showToast("Payment updated successfully", "success");
        fetchOtherPayments();
      } else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherPayments();
  }, []);

  const OtherPaymentColumns: { header: string; accessor: keyof OtherPayment }[] = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Remark", accessor: "remark" },
    { header: "Status", accessor: "status" },
  ];

  return {
    otherPayments,
    loading,
    fetchOtherPayments,
    addOtherPayment,
    updateOtherPayment,
    OtherPaymentColumns,
  };
};
