import React, { useState } from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import AddAdvance from "./AddAdvance";
import { useAdvances } from "./Advances.hooks";
import { Plus } from "lucide-react";

const Advances: React.FC = () => {
  const { advances, loading, fetchAdvances, AdvanceColumns, addAdvance } = useAdvances();
  const [openAdd, setOpenAdd] = useState(false);

  const handleAddAdvance = async (advanceData: any) => {
    const payload = {
      configId: parseInt(advanceData.configId),
      advanceDate: advanceData.advanceDate,
      title: advanceData.title,
      remark: advanceData.remark,
      amount: parseFloat(advanceData.amount),
      status: advanceData.status,
    };
    await addAdvance(payload);
    setOpenAdd(false);
  };

  return (
    <div className="space-y-2">
      <Browse
        title="Advances"
        data={advances}
        columns={AdvanceColumns}
        selectable={false}
        headerActions={() => (
          <div className="space-x-2">
            <Button variant="primary" onClick={() => setOpenAdd(true)}>
              <Plus className="size-5" />
              Add Advance
            </Button>
          </div>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}

      {/* Add Advance Window */}
      <MiniWindow isOpen={openAdd} onClose={() => setOpenAdd(false)} size="small">
        <AddAdvance onClose={() => setOpenAdd(false)} />
      </MiniWindow>
    </div>
  );
};

export default Advances;
