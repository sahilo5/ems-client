import React from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { RefreshCw } from "lucide-react";
import { useSalaryLogs } from "./SalaryLogs.hooks";

const SalaryLogs: React.FC = () => {
    const { logs, loading, fetchLogs, LogColumns } = useSalaryLogs();

    return (
        <div className="space-y-2">
            <Browse
                title="Salary Logs"
                data={logs}
                columns={LogColumns}
                headerActions={
                    <div className="flex gap-2">
                        <Button
                            variant="tertiary"
                            title="Refresh"
                            onClick={fetchLogs}
                        >
                            <RefreshCw className="size-5" />
                        </Button>
                    </div>
                }
            />

            {loading && <Loader size={48} color="text-primary" />}
        </div>
    );
};

export default SalaryLogs;
