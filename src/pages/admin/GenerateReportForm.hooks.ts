import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

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
  companyName:string;
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
  const [reportType, setReportType] = useState<ReportType>("Salary");
  const [periodType, setPeriodType] = useState<"month" | "year">("month");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("2025");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<{ salarySummary: SalarySummary; repaymentSummary: RepaymentSummary | null; otherPaymentsSummary: OtherPaymentsSummary | null }[]>([]);
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

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

  const generateReport = async () => {
    if (!selectedEmployee || (periodType === "month" && !month) || (periodType === "year" && !year)) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      if (reportType === "Salary") {
        // Fetch salary summary
        const payload = {
          username: selectedEmployee,
          month: periodType === "month" ? month : year,
          forReport:true
        };
        const salaryResponse = await api(`/admin/salary/monthly-report`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!salaryResponse.success) {
          showToast(salaryResponse.message || "Failed to fetch salary summary", "error");
          setLoading(false);
          return;
        }

        const salarySummary = salaryResponse.data;

        // Fetch repayment summary (advances)
        const repayResponse = await api(`/admin/salary/get-repayment-summary/${selectedEmployee}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const repaymentSummary = repayResponse.success ? repayResponse.data : null;

        // Fetch other payments summary
        const othersPayload = {
          username: selectedEmployee,
          month: periodType === "month" ? month : year,
        };
        const othersResponse = await api(`/admin/salary/get-other-payments-summary?username=${selectedEmployee}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(othersPayload),
        });

        const otherPaymentsSummary = othersResponse.success ? othersResponse.data : null;

        // Combine data for salary report
        const reportData = {
          salarySummary,
          repaymentSummary,
          otherPaymentsSummary,
        };

        setReportData([reportData]);
        showToast("Salary report generated successfully", "success");
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
