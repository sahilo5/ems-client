import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { SalaryReportData } from "./SalaryReport.hooks";
import { useNavigate } from "react-router-dom";

export type ReportType = "Salary" | "Attendance" | "Ledger" | "Expenses";

type Option = {
  label: string;
  value: string;
};

type Employee = {
  firstName: string;
  lastName: string;
  username: string;
};

export type SalarySummary = {
  employeeName: string;
  username: string;
  perDayAmount: number;
  totalSalary: number;
  presentDays: number;
  workingDays: number;
  halfDayDeduction: number;
  lateDeduction: number;
  deductionsTotal: number;
  calculatedSalary: number;
  bonus: number;
  net: number;
  month: string;
  daysInMonth: number;
  totalMonthSalary: number;
  startDate: string;
  endDate: string;
  sandwichedLeaves: number;
  checkIfDone: boolean;
  leaves: number;
  companyName: string;
};

export type PendingAdvance = {
  id: number;
  employeeName: string;
  username: string;
  advanceDate: string;
  repayDate: string | null;
  title: string;
  remark: string;
  amount: number;
  status: string;
};

export type RepaymentSummary = {
  pendingAdvances: PendingAdvance[];
  totalRemainingAmount: number;
};

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

export type OtherPaymentsSummary = {
  otherPayments: OtherPayment[];
  totalAmount: number;
};

export const useGenerateReport = () => {
  const [employees, setEmployees] = useState<Option[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("Salary");
  const [periodType, setPeriodType] = useState<"month" | "year">("month");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("2025");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<SalaryReportData[]>([]);
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();
  const [popupOpenForSalary, setPopupOpenForSalary] = useState(false);

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const response = await api("/admin/getAllEmployees", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        const mapped = response.data.map((user: Employee) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.username,
        }));
        setEmployees(mapped);
      } else {
        showToast(response.message, "error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const employee = employees.find(emp => emp.value === selectedEmployee);
    setSelectedEmployeeName(employee ? employee.label : "");
  }, [selectedEmployee, employees]);

  const generateReport = async () => {
    if (!selectedEmployee || (periodType === "month" && !month) || (periodType === "year" && !year)) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!token) {
      showToast("Authentication token not found", "error");
      return;
    }

    setLoading(true);
    try {
      if (reportType === "Salary") {
        const username = selectedEmployee
        const res = await api("/admin/salary/monthly-summary", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username, month }),
        });

        if (res.data.net > 0 || !res.data.checkIfDone) {
          setPopupOpenForSalary(true);
        }
        const { generateSalaryReport } = await import("./SalaryReport.hooks");
        const reportData = await generateSalaryReport({
          username: selectedEmployee,
          employeeName: selectedEmployeeName,
          month,
          year,
          periodType,
          token,
          showToast,
        });
        if (reportData) {
          setReportData([reportData]);
        }

      } else {
        // For other report types (Attendance, Ledger, Expenses)
        const params = {
          employeeId: selectedEmployee,
          type: reportType,
          periodType,
          period: periodType === "month" ? month : year,
        };
        const response = await api("/reports/generate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        if (response.success) {
          setReportData(response.data as { salarySummary: SalarySummary; repaymentSummary: RepaymentSummary | null; otherPaymentsSummary: OtherPaymentsSummary | null }[]);
          showToast("Report generated successfully", "success");
        } else {
          showToast(response.message || "Failed to generate report", "error");
        }
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
      showToast("Failed to generate report", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleConfirmForSalary = () => {
    navigate("/admin/salary-management");
  }
  const handleCancelForSalary = () => {
    setPopupOpenForSalary(false);
  }

  const exportReport = () => {
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
    popupOpenForSalary, setPopupOpenForSalary,
    handleConfirmForSalary,
    handleCancelForSalary
  };
};
