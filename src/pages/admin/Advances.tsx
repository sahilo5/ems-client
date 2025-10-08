import React from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import { useAdvances } from "./Advances.hooks";

const Advances: React.FC = () => {
  const { advances, loading, fetchAdvances, AdvanceColumns } = useAdvances();

  return (
    <div className="space-y-2">
      <Browse
        title="Advances"
        data={advances}
        columns={AdvanceColumns}
        selectable={false}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default Advances;
