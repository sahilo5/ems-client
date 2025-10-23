import React, { useContext } from "react";
import Button from "../../components/Button";
import { Printer } from "lucide-react";
import { SalarySummary, RepaymentSummary, OtherPaymentsSummary } from "./GenerateReportForm.hooks";
import { CompanyContext } from "../../context/CompanyContext";

interface SalaryReportProps {
  salarySummary: SalarySummary;
  repaymentSummary: RepaymentSummary | null;
  otherPaymentsSummary: OtherPaymentsSummary | null;
}

const SalaryReport: React.FC<SalaryReportProps> = ({
  salarySummary,
  repaymentSummary,
  otherPaymentsSummary,
}) => {
  const { companyName } = useContext(CompanyContext);
  const generateReportHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
          <div style="text-align: left;">
            <h3 style="font-size: 20px; font-weight: bold; margin: 0;">${companyName}</h3>
            <p style="font-size: 14px; margin: 4px 0;">Employee: ${salarySummary.employeeName}</p>
            <p style="font-size: 14px; margin: 4px 0;">Salary Slip for ${salarySummary.month}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 14px; margin: 4px 0;">Period: ${salarySummary.startDate} to ${salarySummary.endDate}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Attendance Summary</h5>
          <ul style="list-style: none; padding: 0; font-size: 12px;">
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Working Days</span>
              <span style="font-weight: 500;">${salarySummary.workingDays}</span>
            </li>
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Present Days</span>
              <span style="font-weight: 500;">${salarySummary.presentDays}</span>
            </li>
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Absent Days</span>
              <span style="font-weight: 500;">${salarySummary.workingDays - salarySummary.presentDays}</span>
            </li>
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Leaves</span>
              <span style="font-weight: 500;">${salarySummary.leaves}</span>
            </li>
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Sandwich Leaves</span>
              <span style="font-weight: 500;">${salarySummary.sandwichedLeaves}</span>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>Per Day Salary</span>
              <span style="font-weight: 500;">${salarySummary.perDayAmount.toFixed(2)}</span>
            </li>
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Earnings</h5>
          <ul style="list-style: none; padding: 0; font-size: 12px;">
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Gross Salary</span>
              <span style="font-weight: 500; color: #16a34a;">+${salarySummary.totalMonthSalary.toFixed(2)}</span>
            </li>
            ${otherPaymentsSummary?.otherPayments?.filter(payment => payment.type === "bonus").map((bonus, index) => `
              <li style="display: flex; justify-content: space-between; margin-bottom: 4px;" key="${index}">
                <span>${bonus.remark}</span>
                <span style="font-weight: 500; color: #16a34a;">+${bonus.amount.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Deductions</h5>
          <ul style="list-style: none; padding: 0; font-size: 12px;">
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Half Day</span>
              <span style="font-weight: 500; color: #dc2626;">-${salarySummary.halfDayDeduction.toFixed(2)}</span>
            </li>
            <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Late Mark</span>
              <span style="font-weight: 500; color: #dc2626;">-${salarySummary.lateDeduction.toFixed(2)}</span>
            </li>
            ${otherPaymentsSummary?.otherPayments?.filter(payment => payment.type === "deduction").map((deduction, index) => `
              <li style="display: flex; justify-content: space-between; margin-bottom: 4px;" key="${index}">
                <span>${deduction.remark}</span>
                <span style="font-weight: 500; color: #dc2626;">-${deduction.amount.toFixed(2)}</span>
              </li>
            `).join('')}
            <li style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 4px; padding-top: 4px;">
              <span>Total Deductions</span>
              <span style="font-weight: 500; color: #991b1b;">-${((salarySummary.deductionsTotal || 0)).toFixed(2)}</span>
            </li>
          </ul>
        </div>

        ${repaymentSummary?.pendingAdvances?.map((advance) => `
          <div style="margin-bottom: 20px;">
            <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Remaining Advances (Unpaid)</h5>
            <ul style="list-style: none; padding: 0; font-size: 12px;">
              <li style="display: flex; justify-content: space-between; margin-bottom: 4px;" key="${advance.id}">
                <span>${advance.advanceDate} | ${advance.title}</span>
                <span style="font-weight: 500; color: #dc2626;">-${advance.amount.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        `).join('')}

        ${otherPaymentsSummary && otherPaymentsSummary.totalAmount > 0 ? `
          <div style="margin-bottom: 20px;">
            <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Other Payments (Paid)</h5>
            <ul style="list-style: none; padding: 0; font-size: 12px;">
              ${otherPaymentsSummary.otherPayments.map((payment) => `
                <li style="display: flex; justify-content: space-between; margin-bottom: 4px;" key="${payment.id}">
                  <span>${payment.date} | ${payment.remark}</span>
                  <span style="font-weight: 500; color: #16a34a;">+${payment.amount.toFixed(2)}</span>
                </li>
              `).join('')}
              <li style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 4px; padding-top: 4px;">
                <span>Total Other Payments</span>
                <span style="font-weight: 500; color: #166534;">+${otherPaymentsSummary.totalAmount.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        ` : ''}

        <div style="padding-top: 4px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #ccc;">
            <span>Net Amount</span>
            <span>${salarySummary.net.toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div style="text-align: left; width: 45%;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Recipient's Signature</p>
            <div style="border-bottom: 1px solid #000; width: 100%; margin-top: 20px;"></div>
          </div>
          <div style="text-align: right; width: 45%;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Authorized Signature</p>
            <div style="border-bottom: 1px solid #000; width: 100%; margin-top: 20px;"></div>
          </div>
        </div>
      </div>
    `;
  };

  const printReport = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const reportHTML = `
      <html>
        <head>
          <title>Salary Report</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
            }
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${generateReportHTML()}
        </body>
      </html>
    `;

    iframe.contentDocument?.write(reportHTML);
    iframe.contentDocument?.close();
    iframe.contentWindow?.print();

    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
    return (
        <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20 p-20 max-md:p-5 mr-40 ml-40 max-md:mr-0.5 max-md:ml-0.5">
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
                        <span>Sandwich Leaves</span>
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
                        <span className="font-medium text-green-600">+{salarySummary.totalMonthSalary.toFixed(2)}</span>
                    </li>
                    {/* Bonuses */}
                    {otherPaymentsSummary?.otherPayments?.filter(payment => payment.type === "bonus").map((bonus, index: number) => (
                        <li key={index} className="flex justify-between">
                            <span>{bonus.remark}</span>
                            <span className="font-medium text-green-600">+{bonus.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            
            {/* Deductions */}
            <div className="mb-4">
                <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Deductions</h5>
                <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                        <span>Half Day</span>
                        <span className="font-medium text-red-600">-{salarySummary.halfDayDeduction.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Late Mark</span>
                        <span className="font-medium text-red-600">-{salarySummary.lateDeduction.toFixed(2)}</span>
                    </li>

                    {/* Other Deductions */}
                    {otherPaymentsSummary?.otherPayments?.filter(payment => payment.type === "deduction").map((deduction, index: number) => (
                        <li key={index} className="flex justify-between">
                            <span>{deduction.remark}</span>
                            <span className="font-medium text-red-600">-{deduction.amount.toFixed(2)}</span>
                        </li>
                    ))}
                    <li className="flex justify-between font-bold mt-1 pt-1">
                        <span>Total Deductions</span>
                        <span className="font-medium text-red-800">-{((salarySummary.deductionsTotal || 0)).toFixed(2)}</span>
                    </li>
                </ul>
            </div>

            {/* Advances */}
                {repaymentSummary?.pendingAdvances?.map((advance) => (<>
                    <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Advances (Unpaid)</h5>
                    <ul className="space-y-1 text-sm"></ul>
                    <li className="flex justify-between" key={advance.id}>
                        <span>{advance.advanceDate} | {advance.title}</span>
                        <span className="font-medium text-red-600">-{advance.amount.toFixed(2)}</span>
                    </li>
                    <ul />
                </>
                ))}

            {/* Other Payments (Informational) */}
            {otherPaymentsSummary && otherPaymentsSummary.totalAmount > 0 && (
                <div className="mb-4">
                    <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Other Payments (Paid)</h5>
                    <ul className="space-y-1 text-sm">
                        {otherPaymentsSummary.otherPayments.map((payment) => (
                            <li className="flex justify-between" key={payment.id}>
                                <span>{payment.date} | {payment.remark}</span>
                                <span className="font-medium text-green-600">+{payment.amount.toFixed(2)}</span>
                            </li>
                        ))}
                        <li className="flex justify-between font-bold mt-1 pt-1">
                            <span>Total Other Payments</span>
                            <span className="font-medium text-green-700">+{otherPaymentsSummary.totalAmount.toFixed(2)}</span>
                        </li>
                    </ul>
                </div>
            )}


            {/* Summary */}
            <div className="pt-1">
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Net Amount</span>
                    <span>{salarySummary.net.toFixed(2)}</span>
                </div>
            </div>
            <div className="mt-6 text-right">
                <Button variant="primary" title="Print" onClick={printReport}>
                    <span className="flex items-center">
                        Print <Printer className="size-5 ml-2" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default SalaryReport;
