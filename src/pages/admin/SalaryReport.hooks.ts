import { SalarySummary, RepaymentSummary, OtherPaymentsSummary } from "./GenerateReportForm.hooks";
import { api } from "../../utils/api";

export type YearlySalarySummary = { [month: string]: number };

export type SalaryReportData = { salarySummary: SalarySummary; repaymentSummary: RepaymentSummary | null; otherPaymentsSummary: OtherPaymentsSummary | null } | { yearlySummary: YearlySalarySummary; employeeName: string; repaymentSummary: null; otherPaymentsSummary: null };

export interface GenerateSalaryReportParams {
  username: string;
  employeeName: string;
  month: string;
  year: string;
  periodType: "month" | "year";
  token: string;
  showToast: (message: string, type: "success" | "error") => void;
}

export const generateSalaryReport = async ({
  username,
  employeeName,
  month,
  year,
  periodType,
  token,
  showToast,
}: GenerateSalaryReportParams): Promise<SalaryReportData | null> => {
  try {
    if (periodType === "year") {
      // Fetch yearly salary summary
      const yearlyPayload = {
        username,
        year: parseInt(year),
      };
      const yearlyResponse = await api(`/admin/salary/yearly-report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(yearlyPayload),
      });

      if (yearlyResponse===null) {
        showToast(yearlyResponse.message || "Failed to fetch yearly salary summary", "error");
        return null;
      }

      const yearlySummary = yearlyResponse;

      // Combine data for yearly salary report
      const reportData: SalaryReportData = {
        yearlySummary,
        employeeName,
        repaymentSummary: null,
        otherPaymentsSummary: null,
      };

      showToast("Yearly salary report generated successfully", "success");
      return reportData;
    } else {
      // Fetch monthly salary summary
      const payload = {
        username,
        month,
        forReport: true,
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
        return null;
      }

      const salarySummary = salaryResponse.data;

      // Fetch repayment summary (advances)
      const repayResponse = await api(`/admin/salary/get-repayment-summary/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const repaymentSummary = repayResponse.success ? repayResponse.data : null;

      // Fetch other payments summary
      const othersPayload = {
        username,
        month,
      };
      const othersResponse = await api(`/admin/salary/get-other-payments-summary?username=${username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(othersPayload),
      });

      const otherPaymentsSummary = othersResponse.success ? othersResponse.data : null;

      // Combine data for monthly salary report
      const reportData: SalaryReportData = {
        salarySummary,
        repaymentSummary,
        otherPaymentsSummary,
      };

      showToast("Monthly salary report generated successfully", "success");
      return reportData;
    }
  } catch (error) {
    console.error("Failed to generate salary report:", error);
    showToast("Failed to generate salary report", "error");
    return null;
  }
};
