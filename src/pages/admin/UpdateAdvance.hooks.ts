import { useState, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { Advance } from "./Advances.hooks";

export const useUpdateAdvance = (advance: Advance) => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: advance.username,
    advanceDate: advance.advanceDate,
    title: advance.title,
    remark: advance.remark,
    amount: advance.amount,
    status: advance.status,
  });
  const [loading, setLoading] = useState(false);

  const updateAdvance = async () => {
    setLoading(true);
    try {
      const res = await api(`/admin/salary/advances/${advance.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
  };

  return {
    formData,
    setFormData,
    updateAdvance,
    loading,
  };
};