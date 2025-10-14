import React, { useState } from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import AddAdvance from "./AddAdvance";
import { useAdvances, Advance } from "./Advances.hooks";
import { Plus, RefreshCw, SquarePen } from "lucide-react";
import UpdateAdvance from "./UpdateAdvance";

const Advances: React.FC = () => {
  const { advances, loading, fetchAdvances, AdvanceColumns } = useAdvances();
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);

  const handleUpdate = (advance: Advance) => {
    setSelectedAdvance(advance);
    setOpenUpdate(true);
  };

  return (
    <div className="space-y-2">
      <Browse
        title="Advances"
        data={advances}
        columns={AdvanceColumns}
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="tertiary"
              title="Add Advance"
              onClick={() => setOpenAdd(true)}
            >
              <Plus className="size-5" />
            </Button>
            <Button
              variant="tertiary"
              title="Refresh"
              onClick={fetchAdvances}
            >
              <RefreshCw className="size-5" />
            </Button>
            
          </div>
        }
        rowActions={(rowData) => (
          <Button
            variant="refresh"
            title="Update"
            onClick={() => handleUpdate(rowData as Advance)}
          >
            <SquarePen className="size-4" />
          </Button>
        )}
      />

      {loading && <Loader size={48} color="text-primary" />}

      {/* Add Advance Window */}
      <MiniWindow isOpen={openAdd} onClose={() => setOpenAdd(false)} size="small">
        <AddAdvance onClose={() => setOpenAdd(false)} />
      </MiniWindow>

      {/* Update Advance Window */}
      {selectedAdvance && (
        <MiniWindow isOpen={openUpdate} onClose={() => setOpenUpdate(false)} size="small">
          <UpdateAdvance
            onClose={() => setOpenUpdate(false)}
            advance={selectedAdvance}
          />
        </MiniWindow>
      )}
    </div>
  );
};

export default Advances;
