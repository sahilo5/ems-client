import React, { useState } from "react";
import Button from "../../components/Button";
import Toggle from "../../components/Toggle";
import Form from "../../components/Form";
import Dropdown from "../../components/Dropdown";
import { useSalaryPaymentLogic } from "./SalaryPayment.hooks";
import MiniWindow from "../../components/MiniWindow";
import AddOtherPayment from "./AddOtherPayment";
import Popup from "../../components/Popup";
import dayjs from "dayjs";

const SalaryPayment: React.FC = () => {
    const {
        selectedEmployee,
        setSelectedEmployee,
        selectedMonth,
        setSelectedMonth,
        employees,
        errors,
        salarySummary,
        repaymentSummary,
        otherPaymentsSummary,
        loading,
        generateReport,
        handlePayConfirm,
        popupOpen, setPopupOpen,
        deductAdvance, setDeductAdvance
    } = useSalaryPaymentLogic();

    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                {/* Generate Salary Report Section */}
                <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 p-6 ">
                    <h3 className="text-lg font-semibold mb-4 text-primary">Generate Salary Report</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                        <div className="w-full md:w-2/5">
                            <Dropdown
                                label="Employee"
                                options={employees}
                                value={selectedEmployee}
                                onChange={setSelectedEmployee}
                            />
                            {errors.employeeError && <span className="text-red-500 text-sm">{errors.employeeError}</span>}
                        </div>
                        <div className="w-full md:w-2/5">
                            <Form
                                fields={[
                                    {
                                        type: "month",
                                        name: "month",
                                        label: "Month",
                                        value: selectedMonth,
                                        onChange: setSelectedMonth,
                                    },
                                ]}
                            />
                            {errors.monthError && <span className="text-red-500 text-sm">{errors.monthError}</span>}
                        </div>
                        <Button variant="primary" className="px-6 py-2" onClick={generateReport} disabled={loading}>
                            {loading ? "Generating..." : "Generate"}
                        </Button>
                    </div>
                    <div className="space-y-4 pr-8 max-sm:pr-0">

                        <div className="flex items-center justify-between gap-12">
                            <span className="text-sm font-medium text-dark">Deduct Advance : </span>
                            <Toggle
                                checked={deductAdvance}
                                onChange={setDeductAdvance}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-5">
                            <span className="text-sm font-medium text-dark">Add Other Payments : </span>
                            <Button variant="primary" className="px-4 py-2" title="Add New Payment"
                                onClick={() => setIsAddPaymentOpen(true)}>
                                Add
                            </Button>
                        </div>
                        <hr />
                        <div className="w-full">
                            <table className="w-full text-sm table-fixed">
                                <thead>
                                    <tr>
                                        <th className="w-1/4 text-left text-sm font-medium text-dark p-2 pl-18 max-md:pl-0 border-b">Advances</th>
                                        <th className="w-1/4 text-right text-sm font-medium text-dark p-2 border-r-1 border-b">Amount</th>
                                        <th className="w-1/4 text-left text-sm font-medium text-dark p-2 pl-13 max-md:pl-2 border-b">Other Payments</th>
                                        <th className="w-1/4 text-right text-sm font-medium text-dark p-2 border-b">Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.from({ length: Math.max(repaymentSummary?.pendingAdvances.length || 0, otherPaymentsSummary?.otherPayments.length || 0) }).map((_, index) => {
                                        const advance = repaymentSummary?.pendingAdvances[index];
                                        const payment = otherPaymentsSummary?.otherPayments[index];
                                        return (
                                            <tr key={index}>
                                                {advance ? (
                                                    <>
                                                        <td className="p-1">{advance.advanceDate}</td>
                                                        <td className="p-1 text-right text-red-600 pr-2 border-r-1 border-dark">-{advance.amount}</td>
                                                    </>
                                                ) : (
                                                    <><td className="p-1"></td><td className="py-1"></td></>
                                                )}
                                                {payment ? (
                                                    <>
                                                        <td className="p-1">{payment.date}</td>
                                                        <td className="p-1 text-right text-green-600 pr-2 ">+{payment.amount}</td>
                                                    </>
                                                ) : (
                                                    <><td className="p-1"></td><td className="py-1"></td></>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td className="py-1 font-medium">Total</td>
                                        <td className="py-1 text-right font-medium text-red-600 pr-2 border-r-1 border-dark">
                                            {repaymentSummary?.totalRemainingAmount != null ? `-${repaymentSummary.totalRemainingAmount}` : ''}
                                        </td>
                                        <td className="py-1 font-medium pl-4">Total</td>
                                        <td className="py-1 text-right font-medium text-green-600 pr-2">
                                            {otherPaymentsSummary?.totalAmount != null ? `+${otherPaymentsSummary.totalAmount}` : ''}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 max-md:p-3 p-6">

                {salarySummary ? (
                    <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 p-20 max-md:p-5">
                        <div className="text-center mb-4">
                            <h4 className="font-bold text-lg">{salarySummary.employeeName}</h4>
                            <p className="text-sm text-gray-600">Salary Slip for {salarySummary.month}</p>
                            <p className="text-sm text-gray-500 m-2">{salarySummary.startDate} to {salarySummary.endDate}</p>
                        </div>

                        {/* Attendance Summary */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Attendance Summary</h5>
                            <ul className="space-y-1 text-sm">
                                <li className="flex justify-between">
                                    <span>Working Days</span>
                                    <span className="font-medium">{salarySummary.workingDays}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Present Days</span>
                                    <span className="font-medium">{salarySummary.presentDays}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Absent Days</span>
                                    <span className="font-medium">{salarySummary.workingDays - salarySummary.presentDays}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Leaves</span>
                                    <span className="font-medium">{salarySummary.leaves}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Sandwitch Leaves</span>
                                    <span className="font-medium">{salarySummary.sandwichedLeaves}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Per Day Salary</span>
                                    <span className="font-medium">{salarySummary.perDayAmount.toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Earnings */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Earnings</h5>
                            <ul className="space-y-1 text-sm">
                                <li className="flex justify-between">
                                    <span>Gross Salary</span>
                                    <span className="font-medium text-green-600">+{(salarySummary.totalMonthSalary).toFixed(2)}</span>
                                </li>
                                {/* <li className="flex justify-between">
                                    <span>Bonus</span>
                                    <span className="font-medium text-green-600">+{salarySummary.bonus}</span>
                                </li> */}
                            </ul>
                        </div>

                        {/* Other Payments (Informational) */}
                        {otherPaymentsSummary && otherPaymentsSummary.totalAmount > 0 && (
                            <div className="mb-4">
                                <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Other Payments (Paid)</h5>
                                <ul className="space-y-1 text-sm">
                                    {otherPaymentsSummary.otherPayments.map((payment) => (
                                        <li className="flex justify-between" key={payment.id}>
                                            <span>{payment.date} | {payment.remark} </span>
                                            <span className="font-medium text-green-600">+{(payment.amount).toFixed(2)}</span>
                                        </li>
                                    ))}
                                    <li className="flex justify-between font-bold mt-1 pt-1">
                                        <span>Total Other Payments</span>
                                        <span className="font-medium text-green-700">+{(otherPaymentsSummary.totalAmount).toFixed(2)}</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Deductions */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Deductions</h5>
                            <ul className="space-y-1 text-sm">
                                <li className="flex justify-between">
                                    <span>Half Day</span>
                                    <span className="font-medium text-red-600">-{(salarySummary.halfDayDeduction).toFixed(2)}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Late Mark</span>
                                    <span className="font-medium text-red-600">-{(salarySummary.lateDeduction).toFixed(2)}</span>
                                </li>
                                
                                {deductAdvance && repaymentSummary?.pendingAdvances.map((advance) => (
                                    <li className="flex justify-between" key={advance.id}>
                                        <span> {advance.advanceDate} | {advance.title}</span>
                                        <span className="font-medium text-red-600">-{(advance.amount).toFixed(2)}</span>
                                    </li>
                                ))}
                                <li className="flex justify-between font-bold mt-1 pt-1">
                                        <span>Total Deductions</span>   
                                        <span className="font-medium text-red-800">-{(salarySummary.deductionsTotal + (deductAdvance && repaymentSummary ? repaymentSummary?.totalRemainingAmount || 0 : 0)).toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>



                        {/* Summary */}
                        <div className="pt-1">
                            {/* {deductAdvance && (
                                <div className="flex justify-between font-semibold text-sm text-red-600 mb-1">
                                    <span>Advance Deduction</span>
                                    <span>-{(repaymentSummary?.totalRemainingAmount || 0).toFixed(2)}</span>
                                </div>
                            )} */}
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                                <span>Net Amount</span>
                                <span>
                                    {(() => {
                                        const finalAmount = salarySummary.net - (deductAdvance ? repaymentSummary?.totalRemainingAmount || 0 : 0);
                                        return finalAmount.toFixed(2);
                                    })()}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                        <Button
                            variant={salarySummary.checkIfDone ? "secondary" : "primary"}
                            disabled={salarySummary.checkIfDone}
                            className="w-full md:w-auto"
                            onClick={() => setPopupOpen(true)}
                        >
                            {salarySummary.checkIfDone ? "Already Paid" : "Pay Now"}
                        </Button>
                    </div>
                    </div>
                ) : (<>
                    <h3 className="text-lg font-semibold text-primary p-2">Salary Report</h3>
                    <p className="text-gray-500">Report will be generated here...</p>
                    </>
                )}
            </div>
            <MiniWindow
                isOpen={isAddPaymentOpen}
                onClose={() => setIsAddPaymentOpen(false)}
                size="small"
            >
                <AddOtherPayment onClose={() => setIsAddPaymentOpen(false)} />
            </MiniWindow>
            {/* Confirmation Popup */}
            <Popup
                title="Confirm Payment"
                content={`Are you sure you want to mark salary as PAID for ${salarySummary ? salarySummary?.employeeName || "unknown" : "unknown"} for ${dayjs(
                  salarySummary ? salarySummary?.month || "month" : "month"
                ).format("MMMM YYYY")}?`}
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onCancel={() => setPopupOpen(false)}
                onConfirm={async () => {
                    if (salarySummary) {
                        await handlePayConfirm();
                    }
                }}
                confirmLabel="Yes, Pay"
                cancelLabel="Cancel"
                variant="confirm"
            />
        </div>
    );
};

export default SalaryPayment;
