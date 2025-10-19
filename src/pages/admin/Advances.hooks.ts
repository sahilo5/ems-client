import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type Advance = {
  id: number;
  employeeName: string;
  username: string;
  advanceDate: string;
  repayDate: string;
  title: string;
  remark: string;
  amount: number;
  status: string;
};

export const useAdvances = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [advances, setAdvances] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/advances", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.success) setAdvances(res.data);
      else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const addAdvance = async (advanceData: Omit<Advance, "id" | "employeeName">) => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/advances", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(advanceData),
      });
      if (res.success) {
        showToast("Advance added successfully", "success");
        fetchAdvances();
      } else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateAdvance = async (advanceData: Advance) => {
    setLoading(true);
    if(advanceData.status === "REPAYED"){
      const today: Date = new Date();
      advanceData.repayDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }else{
      advanceData.repayDate = "";
    }
    console.log(advanceData.repayDate);
    console.log("Full payload:", advanceData);
    try {
      const res = await api(`/admin/salary/advances/${advanceData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(advanceData),
      });
      if (res.success) {
        showToast("Advance updated successfully", "success");
        fetchAdvances();
      } else showToast(res.message, "error");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, []);

  const AdvanceColumns: { header: string; accessor: keyof Advance }[] = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Title", accessor: "title" },
    { header: "Remark", accessor: "remark" },
    { header: "Advance Date", accessor: "advanceDate" },
    { header: "Repay Date", accessor: "repayDate" },
    { header: "Status", accessor: "status" },
    { header: "Amount", accessor: "amount" },
  ];

  return {
    advances,
    loading,
    fetchAdvances,
    addAdvance,
    updateAdvance,
    AdvanceColumns,
  };
};
