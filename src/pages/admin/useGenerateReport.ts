import { useState, useEffect } from "react";
import { api } from "../../utils/api";

export type ReportType = "Salary" | "Attendance" | "Ledger" | "Expenses";

export type Employee = {
  id: number;
  name: string;
};

export const useGenerateReport = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("Salary");
  const [periodType, setPeriodType] = useState<"month" | "year">("month");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    // Fetch employees on mount
    const fetchEmployees = async () => {
      try {
        const data = await api("/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const generateReport = async () => {
    if (!selectedEmployee || (periodType === "month" && !month) || (periodType === "year" && !year)) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const params = {
        employeeId: selectedEmployee,
        type: reportType,
        periodType,
        period: periodType === "month" ? month : year,
      };
      const data = await api("/reports/generate", {
        method: "POST",
        body: JSON.stringify(params),
      });
      setReportData(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // TODO: Implement export logic
    alert("Export functionality not implemented yet");
  };

  return {
    employees,
    selectedEmployee,
    setSelectedEmployee,
    reportType,
    setReportType,
    periodType,
    setPeriodType,
    month,
    setMonth,
    year,
    setYear,
    loading,
    reportData,
    generateReport,
    exportReport,
  };
};
