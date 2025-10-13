import { useState } from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Edit, RefreshCcw } from "lucide-react";
import { useSalaryManagement } from "./SalaryManagement.hooks";
import MiniWindow from "../../components/MiniWindow";
import EditSalaryConfig from "./EditSalaryConfig";
import React from "react";
import SalarySummary from "./SalarySummary";
import Advances from "./Advances";
import OtherPayments from "./OtherPayments";

const SalaryManagement = () => {
  const { configs, logs, loading, fetchConfigs, fetchLogs, ConfigColumns, LogColumns } = useSalaryManagement();

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        {/* Salary Config Tab */}
        <Tab index={0} label="Payment"><SalarySummary/></Tab>
        <Tab index={1} label="Salary Config" onClick={fetchConfigs}>
          <Browse
  title="Salary Config"
  data={configs}
  columns={ConfigColumns}
  selectable={true}
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
        </Tab>

        {/* Salary Logs Tab */}
        <Tab index={2} label="Logs" onClick={fetchLogs}>
          <Browse title="Salary Logs" data={logs} columns={LogColumns} selectable={false} />
          {loading && <Loader size={48} color="text-primary" />}
        </Tab>

        {/* Advances Tab */}
        <Tab index={3} label="Advances">
          <Advances />
        </Tab>

        {/* Other Payments Tab */}
        <Tab index={4} label="Other Payments">
          <OtherPayments />
        </Tab>
      </Tabs>

      {/* Edit Config Window */}
      <MiniWindow isOpen={openEdit} onClose={() => setOpenEdit(false)} size="small">
        {editData && <EditSalaryConfig config={editData} onClose={() => setOpenEdit(false)} />}
      </MiniWindow>
    </div>
  );
};

export default SalaryManagement;
