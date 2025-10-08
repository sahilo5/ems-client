import React from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import { useOtherPayments } from "./OtherPayments.hooks";

const OtherPayments: React.FC = () => {
  const { otherPayments, loading, fetchOtherPayments, OtherPaymentColumns } = useOtherPayments();

  return (
    <div className="space-y-2">
      <Browse
        title="Other Payments"
        data={otherPayments}
        columns={OtherPaymentColumns}
        selectable={false}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default OtherPayments;
