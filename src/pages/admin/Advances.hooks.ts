import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type Advance = {
  id: number;
  employeeName: string;
  configId: number;
  advanceDate: string;
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
    } catch (err: any) {
      showToast(err.message, "error");
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
    } catch (err: any) {
      showToast(err.message, "error");
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
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "advanceDate" },
    { header: "Remark", accessor: "remark" },
    { header: "Status", accessor: "status" },
  ];

  return {
    advances,
    loading,
    fetchAdvances,
    addAdvance,
    AdvanceColumns,
  };
};
