import React from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Download } from "lucide-react";
import { useSalaryReports } from "./SalaryReports.hooks";

const SalaryReports: React.FC = () => {
  const { salaryReports, loading, fetchSalaryReports, exportSalaryReport, SalaryReportColumns } = useSalaryReports();

  return (
    <div className="space-y-2">
      <Browse
        title="Salary Reports"
        data={salaryReports}
        columns={SalaryReportColumns}
        selectable={false}
        headerActions={() => (
          <div className="space-x-2">
            <Button variant="tertiary" title="Export" onClick={exportSalaryReport}>
              <Download className="size-5" />
            </Button>
          </div>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default SalaryReports;
