import React from "react";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Browse from "../../components/Browse";
import SalaryReport from "./SalaryReport";
import YearlySalaryReport from "./YearlySalaryReport";
import Label from "../../components/Label";
import { Download, Printer } from "lucide-react";
import { useGenerateReport, ReportType } from "./GenerateReportForm.hooks";
import Popup from "../../components/Popup";

const GenerateReportForm: React.FC = () => {
  const {
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
    popupOpenForSalary, setPopupOpenForSalary, handleConfirmForSalary,
    handleCancelForSalary
  } = useGenerateReport();

  const employeeOptions = employees;

  const reportTypeOptions: { label: string; value: ReportType }[] = [
    { label: "Salary", value: "Salary" },
    { label: "Attendance", value: "Attendance" },
    // { label: "Ledger", value: "Ledger" },
    // { label: "Expenses", value: "Expenses" },
  ];

  const getReportColumns = () => {
    switch (reportType) {
      case "Salary":
        return [
          { header: "Employee", accessor: "employeeName" },
          { header: "Month", accessor: "month" },
          { header: "Base Salary", accessor: "baseSalary" },
          { header: "Deductions", accessor: "deductions" },
          { header: "Net Salary", accessor: "netSalary" },
        ];
      case "Attendance":
        return [
          { header: "Employee", accessor: "employeeName" },
          { header: "Date", accessor: "date" },
          { header: "Status", accessor: "status" },
          { header: "Hours", accessor: "hours" },
        ];
      case "Ledger":
        return [
          { header: "Date", accessor: "date" },
          { header: "Description", accessor: "description" },
          { header: "Debit", accessor: "debit" },
          { header: "Credit", accessor: "credit" },
          { header: "Balance", accessor: "balance" },
        ];
      case "Expenses":
        return [
          { header: "Category", accessor: "category" },
          { header: "Amount", accessor: "amount" },
          { header: "Date", accessor: "date" },
          { header: "Description", accessor: "description" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Side: Form */}
      <div className="space-y-6">
        <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Generate Report</h3>
          <div className="flex flex-col gap-4 items-start mb-4">
            <div className="w-full">
              <Dropdown
                label="Employee"
                options={employeeOptions}
                value={selectedEmployee}
                onChange={setSelectedEmployee}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Type"
                options={reportTypeOptions}
                value={reportType}
                onChange={(value) => setReportType(value as ReportType)}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Period"
                options={[
                  { label: "Month", value: "month" },
                  { label: "Year", value: "year" },
                ]}
                value={periodType}
                onChange={(value) => setPeriodType(value as "month" | "year")}
              />
            </div>
            {periodType === "month" ? (
              <div className="w-full flex flex-col space-y-2">
                <Label text="Select Month" status="Required" />
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="border border-white/40 bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            ) : (
              <div className="w-full">
                <Dropdown
                  label="Select Year"
                  options={[
                    { label: "2025", value: "2025" },
                  ]}
                  value={year}
                  onChange={setYear}
                />
              </div>
            )}
            <Button variant="primary" className="px-6 py-2 w-full" onClick={generateReport} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side: Report Display */}
      <div className="lg:col-span-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 max-md:p-3 p-6">
        {reportData.length > 0 ? (
          <div className="space-y-2">
            {reportType === "Salary" ? (
              "salarySummary" in reportData[0] ? (
                <SalaryReport
                  salarySummary={reportData[0].salarySummary}
                  repaymentSummary={reportData[0].repaymentSummary}
                  otherPaymentsSummary={reportData[0].otherPaymentsSummary}
                />
              ) : (
                <YearlySalaryReport
                  yearlySalaryData={reportData[0].yearlySummary}
                  employeeName={reportData[0].employeeName || "Unknown"}
                  year={year}
                />
              )
            ) : (
              <Browse
                title={`${reportType} Report`}
                data={reportData as Record<string, unknown>[]}
                columns={getReportColumns() as { header: string; accessor: string }[]}
                headerActions={
                  <div className="space-x-2">
                    <Button variant="tertiary" title="Export" onClick={exportReport}>
                      <Download className="size-5" />
                    </Button>
                    <Button variant="tertiary" title="Print" onClick={() => window.print()}>
                      <Printer className="size-5" />
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-primary p-2">Report</h3>
            <p className="text-gray-500">Report will be generated here...</p>
          </>
        )}
        {loading && <Loader size={48} color="text-primary" />}
      </div>
      <Popup
        title="Confirm"
        content={`Payment for ${month} is not done Yet!! \n Click confirm to pay Salary.`}
        isOpen={popupOpenForSalary}
        onClose={() => setPopupOpenForSalary(false)}
        onConfirm={handleConfirmForSalary}
        onCancel={handleCancelForSalary}
        variant="confirm"
      />
    </div>
  );
};

export default GenerateReportForm;
