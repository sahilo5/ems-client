import React from "react";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Browse from "../../components/Browse";
import { Download } from "lucide-react";
import { useGenerateReport, ReportType } from "./useGenerateReport";

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
  } = useGenerateReport();

  const employeeOptions = employees.map((emp) => ({
    label: emp.name,
    value: emp.id.toString(),
  }));

  const reportTypeOptions: { label: string; value: ReportType }[] = [
    { label: "Salary", value: "Salary" },
    { label: "Attendance", value: "Attendance" },
    { label: "Ledger", value: "Ledger" },
    { label: "Expenses", value: "Expenses" },
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
    <div className="w-full backdrop-blur-sm bg-white/40 text-dark shadow-inner shadow-white/50 border-white p-4 rounded-lg border mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Employee Dropdown */}
        <Dropdown
          label="Employee Name"
          options={employeeOptions}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
        />

        {/* Report Type Dropdown */}
        <Dropdown
          label="Type"
          options={reportTypeOptions}
          value={reportType}
          onChange={(value) => setReportType(value as ReportType)}
        />

        {/* Period Type Radio Buttons */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-dark">Period</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="month"
                checked={periodType === "month"}
                onChange={() => setPeriodType("month")}
                className="mr-2"
              />
              Month
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="year"
                checked={periodType === "year"}
                onChange={() => setPeriodType("year")}
                className="mr-2"
              />
              Year
            </label>
          </div>
        </div>

        {/* Conditional Selector */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-dark">
            {periodType === "month" ? "Select Month" : "Select Year"}
          </label>
          {periodType === "month" ? (
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-white/40 bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          ) : (
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              className="border border-white/40 bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              min="2000"
              max="2100"
            />
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button onClick={generateReport} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </Button>
      </div>

      {/* Report Display */}
      {reportData.length > 0 && (
        <div className="space-y-2">
          <Browse
            title={`${reportType} Report`}
            data={reportData}
            columns={getReportColumns()}
            headerActions={
              <div className="space-x-2">
                <Button variant="tertiary" title="Export" onClick={exportReport}>
                  <Download className="size-5" />
                </Button>
              </div>
            }
          />
        </div>
      )}

      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default GenerateReportForm;
