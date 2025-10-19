import { useState, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { OtherPayment } from "./OtherPayments.hooks";

export const useUpdateOtherPayment = (payment: OtherPayment) => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: payment.username,
    employeeName: payment.employeeName,
    date: payment.date,
    type: payment.type,
    remark: payment.remark,
    amount: payment.amount,
  });
  const [loading, setLoading] = useState(false);

  const updateOtherPayment = async () => {
    setLoading(true);
    try {
      const res = await api(`/admin/salary/other-payments/${payment.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.success) {
        showToast("Payment updated successfully", "success");
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    updateOtherPayment,
    loading,
  };
};