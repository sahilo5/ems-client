import React, { useState } from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import AddAdvance from "./AddAdvance";
import { useAdvances } from "./Advances.hooks";
import { Plus } from "lucide-react";

const Advances: React.FC = () => {
  const { advances, loading, fetchAdvances, AdvanceColumns } = useAdvances();
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="space-y-2">
      <Browse
  title="Advances"
  data={advances}
  columns={AdvanceColumns}
  headerActions={
    
      <Button
        variant="tertiary"
        title="Add Advance"
        onClick={() => setOpenAdd(true)}
      >
        <Plus className="size-5" />
      </Button>
  }
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
