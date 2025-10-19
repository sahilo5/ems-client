import React, { useState } from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import EditSalaryConfig from "./EditSalaryConfig";
import { RefreshCcw, Edit } from "lucide-react";
import { useSalaryConfig } from "./SalaryConfig.hooks";

const SalaryConfig: React.FC = () => {
    const { configs, loading, fetchConfigs, ConfigColumns } = useSalaryConfig();
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    return (
        <div className="space-y-2">
            <Browse
                title="Salary Config"
                data={configs}
                columns={ConfigColumns}
                rowActions={(row) => (
                    <div className="flex gap-2">
                        {/* Row-level Edit */}
                        <Button
                            variant="refresh"
                            title="Edit"
                            onClick={() => {
                                setEditData(row);
                                setOpenEdit(true);
                            }}
                        >
                            <Edit className="size-4" />
                        </Button>
                    </div>
                )}
                headerActions={
                    <div className="space-x-2">
                        {/* Refresh Button */}
                        <Button
                            variant="tertiary"
                            title="Refresh"
                            onClick={fetchConfigs}
                        >
                            <RefreshCcw className="size-5" />
                        </Button>
                    </div>
                }
            />

            {loading && <Loader size={48} color="text-primary" />}

            {/* Edit Config Window */}
            <MiniWindow isOpen={openEdit} onClose={() => setOpenEdit(false)} size="small">
                {editData && <EditSalaryConfig config={editData} onClose={() => setOpenEdit(false)} />}
            </MiniWindow>
        </div>
    );
};

export default SalaryConfig;
