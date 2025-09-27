import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export const useSalaryManagement = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/configs", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.success) setConfigs(res.data);
      else showToast(res.message, "error");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/salary/logs", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.success) setLogs(res.data);
      else showToast(res.message, "error");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (config: any) => {
    setLoading(true);
    try {
      const res = await api(`/admin/salary/config/${config.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (res.success) {
        showToast("Config updated successfully", "success");
        fetchConfigs();
      } else showToast(res.message, "error");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
    fetchLogs();
  }, []);

  const ConfigColumns = [
    { header: "Employee", accessor: "employeeName" },
    { header: "Salary Tier", accessor: "category" },
    { header: "Per-day Amount", accessor: "baseSalary" },
  ];

  const LogColumns = [
    { header: "Employee", accessor: "user.username" },
    { header: "Action", accessor: "action" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
  ];

  return { configs, logs, loading, fetchConfigs, fetchLogs, updateConfig, ConfigColumns, LogColumns };
};
