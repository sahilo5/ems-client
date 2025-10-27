import React, { useContext } from "react";
import Button from "../../components/Button";
import { Printer } from "lucide-react";
import { CompanyContext } from "../../context/CompanyContext";

interface YearlySalaryReportProps {
  yearlySalaryData: Record<string, number>;
  employeeName: string;
  year: string;
}

const YearlySalaryReport: React.FC<YearlySalaryReportProps> = ({
  yearlySalaryData,
  employeeName,
  year,
}) => {
  const { companyName } = useContext(CompanyContext);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalSalary = Object.values(yearlySalaryData).reduce((sum, amount) => sum + amount, 0);

  const generateReportHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
          <div style="text-align: left;">
            <h3 style="font-size: 20px; font-weight: bold; margin: 0;">${companyName}</h3>
            <p style="font-size: 14px; margin: 4px 0;">Employee: ${employeeName}</p>
            <p style="font-size: 14px; margin: 4px 0;">Yearly Salary Report for ${year}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h5 style="font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; text-align: center;">Monthly Salary Breakdown</h5>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Month</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Salary</th>
              </tr>
            </thead>
            <tbody>
              ${months.map((month) => `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 8px;">${month}</td>
                  <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${(yearlySalaryData[month] || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f5f5f5; font-weight: bold;">
                <td style="border: 1px solid #ccc; padding: 8px;">Total</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${totalSalary.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
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
          <title>Yearly Salary Report</title>
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
        <h4 className="font-bold text-lg">{employeeName}</h4>
        <p className="text-sm text-gray-600">Yearly Salary Report for {year}</p>
      </div>

      <div className="mb-4">
        <h5 className="font-semibold text-gray-700 border-b pb-1 mb-2">Monthly Salary Breakdown</h5>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Month</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Salary</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{month}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {(yearlySalaryData[month] || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-2">Total</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{totalSalary.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
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

export default YearlySalaryReport;
