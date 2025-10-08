import React from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Download } from "lucide-react";
import { useLedgerReports } from "./LedgerReports.hooks";

const LedgerReports: React.FC = () => {
  const { ledgerReports, loading, fetchLedgerReports, exportLedgerReport, LedgerReportColumns } = useLedgerReports();

  return (
    <div className="space-y-2">
      <Browse
        title="Ledger Reports"
        data={ledgerReports}
        columns={LedgerReportColumns}
        selectable={false}
        headerActions={() => (
          <div className="space-x-2">
            <Button variant="tertiary" title="Export" onClick={exportLedgerReport}>
              <Download className="size-5" />
            </Button>
          </div>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default LedgerReports;
