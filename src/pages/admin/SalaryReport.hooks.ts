import { useState, useEffect, useContext } from "react";
import { SalarySummary, RepaymentSummary, OtherPaymentsSummary } from "./GenerateReportForm.hooks";
import { CompanyContext } from "../../context/CompanyContext";

interface UseSalaryReportProps {
  employeeId: string;
  month: string;
  year: string;
  periodType: "month" | "year";
}

export const useSalaryReport = ({ employeeId, month, year, periodType }: UseSalaryReportProps) => {
  const [salarySummary, setSalarySummary] = useState<SalarySummary | null>(null);
  const [repaymentSummary, setRepaymentSummary] = useState<RepaymentSummary | null>(null);
  const [otherPaymentsSummary, setOtherPaymentsSummary] = useState<OtherPaymentsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { companyName } = useContext(CompanyContext);

  const fetchSalaryReport = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/salary-report?employeeId=${employeeId}&month=${month}&year=${year}&periodType=${periodType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch salary report");
      }
      const data = await response.json();

      setSalarySummary(data.salarySummary);
      setRepaymentSummary(data.repaymentSummary);
      setOtherPaymentsSummary(data.otherPaymentsSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryReport();
  }, [employeeId, month, year, periodType]);

  return {
    salarySummary,
    repaymentSummary,
    otherPaymentsSummary,
    loading,
    error,
    companyName,
    refetch: fetchSalaryReport,
  };
};
