import React from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Download } from "lucide-react";
import { useExpensesReports } from "./ExpensesReports.hooks";

const ExpensesReports: React.FC = () => {
  const { expensesReports, loading, fetchExpensesReports, exportExpensesReport, ExpenseReportColumns } = useExpensesReports();

  return (
    <div className="space-y-2">
      <Browse
        title="Expenses Reports"
        data={expensesReports}
        columns={ExpenseReportColumns}
        selectable={false}
        headerActions={() => (
          <div className="space-x-2">
            <Button variant="tertiary" title="Export" onClick={exportExpensesReport}>
              <Download className="size-5" />
            </Button>
          </div>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default ExpensesReports;
