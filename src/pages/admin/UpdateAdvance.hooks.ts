import { useState, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { Advance } from "./Advances.hooks";

export const useUpdateAdvance = (advance: Advance) => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    employeeName: advance.employeeName,
    username: advance.username,
    advanceDate: advance.advanceDate,
    repayDate: advance.repayDate,
    title: advance.title,
    remark: advance.remark,
    amount: advance.amount,
    status: advance.status,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.advanceDate) newErrors.advanceDateError = "Advance date is required";
    if (!formData.title.trim()) newErrors.titleError = "Title is required";
    if (!formData.remark.trim()) newErrors.remarkError = "Remark is required";
    if (formData.amount <= 0) newErrors.amountError = "Amount must be greater than zero";
    if (!formData.status) newErrors.statusError = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateAdvance = async () => {
    if (validate()) {
      setLoading(true);
      const payload = { ...formData };
      if (formData.status === "REPAYED") {
        const today = new Date();
        payload.repayDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      } else {
        payload.repayDate = "";
      }
      console.log("Payload:", payload);
      try {
        const res = await api(`/admin/salary/advances/${advance.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (res.success) {
          showToast("Advance updated successfully", "success");
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    formData,
    setFormData,
    updateAdvance,
    loading,
    errors,
  };
};