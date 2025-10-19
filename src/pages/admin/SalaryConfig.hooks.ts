import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type SalaryConfig = {
    id: number;
    employeeName: string;
    username: string;
    category: string;
    baseSalary: number;
};

export const useSalaryConfig = () => {
    const { token } = useContext(AuthContext);
    const { showToast } = useToast();

    const [configs, setConfigs] = useState<SalaryConfig[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const res = await api("/admin/salary/configs", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.success) setConfigs(res.data);
            else showToast(res.message, "error");
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    const updateConfig = async (config: SalaryConfig) => {
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
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const ConfigColumns: { header: string; accessor: keyof SalaryConfig }[] = [
        { header: "Employee", accessor: "employeeName" },
        { header: "Salary Tier", accessor: "category" },
        { header: "Per-day Amount", accessor: "baseSalary" },
    ];

    return {
        configs,
        loading,
        fetchConfigs,
        updateConfig,
        ConfigColumns,
    };
};
