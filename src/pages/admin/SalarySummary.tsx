import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { useSalaryManagement } from "./SalaryManagement.hooks";
import Button from "../../components/Button";
import Popup from "../../components/Popup";
import ThreeDotDropdown from "../../components/ThreeDotDropdown";
import { CompanyContext } from "../../context/CompanyContext";
import { useSalaryPayment } from "./useSalaryPayment";
import { useSalarySummary, useYearlySalarySummary } from "./SalarySummary.hooks";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useToast } from "../../components/ToastProvider";
import Dropdown from "../../components/Dropdown";

const SalarySummary: React.FC = () => {
    const { configs } = useSalaryManagement();
    const [username, setUsername] = useState("");
    const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
    const [popupOpen, setPopupOpen] = useState(false);

    const { data: monthData, loading: monthLoading, checkIfDone } = useSalarySummary(username, month);
    const { fetchYearData } = useYearlySalarySummary();

    const { companyName } = useContext(CompanyContext);
    const { handlePayConfirm } = useSalaryPayment(
        username,
        month
    );
    const { showToast } = useToast();

    // -------- EXPORT HELPERS ----------
    const exportPDF = (scope: "month" | "year") => {
        const exportData = scope === "month" ? monthData : fetchYearData;
        if (!exportData) {
            showToast("No data available to download", "error");
            return;
        }

        const doc = new jsPDF();
        const reportTitle =
            scope === "month"
                ? `Salary Receipt - ${dayjs(month).format("MMMM YYYY")}`
                : `Salary Report - Year ${dayjs(month).year()}`;

        const employeeName = scope === "month" ? monthData.employeeName : monthData?.employeeName || "Employee";

        doc.setFontSize(18);
        doc.text(companyName || "Your Company", 14, 15);
        doc.setFontSize(12);
        doc.text(reportTitle, 14, 25);
        doc.text(`Employee: ${employeeName}`, 14, 35);
        doc.text(`Generated: ${dayjs().format("DD MMM YYYY")}`, 150, 35);
        doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
        doc.setFont("NotoSans");

        if (scope === "month") {
            autoTable(doc, {
                head: [["Item", "Amount"]],
                body: [
                    ["Working Days", `${monthData.presentDays}/${monthData.workingDays}`],
                    ["Per Day Amount", `${monthData.perDayAmount}`],
                    ["Base Salary", `${monthData.totalMonthSalary}`],
                    ["Leave Deduction", `- ${monthData.leaveDeduction}`],
                    ["Half-Day Deduction", `- ${monthData.halfDayDeduction}`],
                    ["Late Deduction", `- ${monthData.lateDeduction}`],
                    ["Total Deductions", `- ${monthData.deductionsTotal}`],
                    // ["Bonus", `+ ${monthData.bonus}`],
                    ["Net Salary", `INR ${monthData.net}`],
                ],
                startY: 45,
            });
        } else if (scope === "year") {
            autoTable(doc, {
                head: [["Month", "Net Salary"]],
                body: Object.entries(fetchYearData).map(([m, value]) => [m, `INR ${value}`]),
                startY: 45,
            });
        }

        doc.save(`${employeeName}_${scope}_salary.pdf`);
    };

    const exportExcel = (scope: "month" | "year") => {
        const exportData = scope === "month" ? monthData : fetchYearData;
        if (!exportData) {
            showToast("No data available to download", "error");
            return;
        }

        let rows: any[] = [];
        if (scope === "month") {
            rows = [
                { Item: "Working Days", Value: `${monthData.presentDays}/${monthData.workingDays}` },
                { Item: "Per Day Amount", Value: `${monthData.perDayAmount}` },
                { Item: "Base Salary", Value: `${monthData.totalMonthSalary}` },
                { Item: "Leave Deduction", Value: `- ${monthData.leaveDeduction}` },
                { Item: "Half-Day Deduction", Value: `- ${monthData.halfDayDeduction}` },
                { Item: "Late Deduction", Value: `- ${monthData.lateDeduction}` },
                { Item: "Total Deductions", Value: `- ${monthData.deductionsTotal}` },
                // { Item: "Bonus", Value: `+INR ${monthData.bonus}` },
                { Item: "Net Salary", Value: `INR ${monthData.net}` },
            ];
        } else if (scope === "year") {
            rows = Object.entries(fetchYearData).map(([m, value]) => ({
                Month: m,
                NetSalary: `INR ${value}`,
            }));
        }

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            wb,
            ws,
            scope === "month" ? dayjs(month).format("MMMM") : `Year ${dayjs(month).year()}`
        );
        const employeeName = monthData?.employeeName || "Employee";
        XLSX.writeFile(wb, `${employeeName}_${scope}_salary.xlsx`);
    };

    const handleExportYearlyPDF = async () => {
        if (!username) {
            showToast("Select an employee first", "error");
            return;
        }

        const year = dayjs(month).year();
        const yearData = await fetchYearData(username, year);

        if (!yearData) return;

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Salary Report - Year ${year}`, 14, 15);

        autoTable(doc, {
            head: [["Month", "Net Salary"]],
            body: Object.entries(yearData).map(([m, value]) => [m, `INR ${value}`]),
            startY: 25,
        });

        doc.save(`${username}_${year}_salary.pdf`);
    };

    const handleExportYearlyExcel = async () => {
        if (!username) {
            showToast("Select an employee first", "error");
            return;
        }

        const year = dayjs(month).year();
        const yearData = await fetchYearData(username, year);

        if (!yearData) return;

        const rows = Object.entries(yearData).map(([m, value]) => ({
            Month: m,
            NetSalary: `INR ${value}`,
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Year ${year}`);
        XLSX.writeFile(wb, `${username}_${year}_salary.xlsx`);
    };

    const dropdownOptions = [
        { label: "Download Monthly PDF", onClick: () => exportPDF("month") },
        { label: "Download Monthly Excel", onClick: () => exportExcel("month") },
        { label: "Download Yearly PDF", onClick: handleExportYearlyPDF },
        { label: "Download Yearly Excel", onClick: handleExportYearlyExcel },
    ];


    return (
        <div className="space-y-6 ">
            {/* Filters */}
            <div className="md:flex-row space-x-4 items-center p-4">
                <select
                    className="border px-4 py-2 pr-10 text-sm w-50
                    rounded-md border-secondary bg-white text-dark
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                >
                    <option value="">Select Employee</option>
                    {configs.map((c) => (
                        <option key={c.id} value={c.username}>
                            {c.employeeName}
                        </option>
                    ))}
                </select>

                <input
                    aria-label="Select month and year"
                    className="border px-3 py-2 m-2 text-sm w-50
                    rounded-md border-secondary bg-white text-dark
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
            </div>

            {/* Salary Summary */}
            {username && month && monthData && !monthLoading && (
                <div className="border border-accent rounded-xl p-6 shadow-lg max-w-xl mx-auto bg-white relative">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold mb-6 text-dark">
                            {monthData.employeeName} | {dayjs(month).format("MMMM YYYY")}
                        </h3>
                        <ThreeDotDropdown options={dropdownOptions} />
                    </div>

                    {/* Salary details */}
                    <div className="space-y-3">
                        <hr />
                        <div className="flex justify-between">
                            <span>Working Days</span>
                            <span>{monthData.presentDays}/{monthData.workingDays}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Salary</span>
                            <span>₹{monthData.totalSalary}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Per Day Amount</span>
                            <span>₹{monthData.perDayAmount}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-indigo-600">
                            <span>Base Salary</span>
                            <span>₹{monthData.totalMonthSalary}</span>
                        </div>

                        <div className="flex justify-between text-red-600">
                            <span>Leave Deduction</span>
                            <span>-₹{monthData.leaveDeduction}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Half-Day Deduction</span>
                            <span>-₹{monthData.halfDayDeduction}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Late Deduction</span>
                            <span>-₹{monthData.lateDeduction}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-red-700">
                            <span>Total Deductions</span>
                            <span>-₹{monthData.deductionsTotal}</span>
                        </div>
                        {/* <div className="flex justify-between text-green-700">
                            <span>Bonus</span>
                            <span>+₹{monthData.bonus}</span>
                        </div> */}
                        <div className="flex justify-between font-bold text-lg border-2 border-gray-300 p-2 ">
                            <span>Net Salary</span>
                            <span>₹{monthData.net}</span>
                        </div>
                    </div>

                    <div className="mt-6 text-right">
                        <Button
                            variant={checkIfDone ? "secondary" : "primary"}
                            disabled={checkIfDone}
                            className="w-full md:w-auto"
                            onClick={() => setPopupOpen(true)}
                        >
                            {checkIfDone ? "Already Paid" : "Pay Now"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
            <Popup
                title="Confirm Payment"
                content={`Are you sure you want to mark salary as PAID for ${monthData?.employeeName} for ${dayjs(
                    month
                ).format("MMMM YYYY")}?`}
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onCancel={() => setPopupOpen(false)}
                onConfirm={() =>
                    handlePayConfirm(monthData, () => {
                        setPopupOpen(false);
                    })
                }
                confirmLabel="Yes, Pay"
                cancelLabel="Cancel"
                variant="confirm"
            />
        </div>
    );
};

export default SalarySummary;
