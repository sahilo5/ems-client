import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type SalaryLog = {
    id: number;
    employeeName: string;
    username: string;
    salaryMonth: string;
    grossSalary: number;
    advanceTotal:number;
    otherPaymentsTotal:number;
    netSalary:number;
    startDate: string;
    endDate: string;
};

export const useSalaryLogs = () => {
    const { token } = useContext(AuthContext);
    const { showToast } = useToast();

    const [logs, setLogs] = useState<SalaryLog[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api("/admin/salary/salary-logs/all", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.success) setLogs(res.data);
            else showToast(res.message, "error");
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const LogColumns: { header: string; accessor: keyof SalaryLog }[] = [
        { header: "Employee", accessor: "employeeName" },
        { header: "Salary Month", accessor: "salaryMonth" },
        { header: "Gross Salary", accessor: "grossSalary" },
        { header: "Advance", accessor: "advanceTotal" },
        { header: "Other Payments", accessor: "otherPaymentsTotal" },
        { header: "Net Salary", accessor: "netSalary" },
        { header: "From Date", accessor: "startDate" },
        { header: "To Date", accessor: "endDate" },
    ];

    return {
        logs,
        loading,
        fetchLogs,
        LogColumns,
    };
};
