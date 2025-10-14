import React, { useState } from "react";
import Browse from "../../components/Browse";
import Loader from "../../components/Loader";
import { useOtherPayments, OtherPayment } from "./OtherPayments.hooks";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import AddOtherPayment from "./AddOtherPayment";
import UpdateOtherPayment from "./UpdateOtherPayment";
import { Plus, RefreshCw, SquarePen } from "lucide-react";

const OtherPayments: React.FC = () => {
  const { otherPayments, loading, fetchOtherPayments, OtherPaymentColumns } = useOtherPayments();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isUpdatePaymentOpen, setIsUpdatePaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<OtherPayment | null>(null);

  const handleUpdate = (payment: OtherPayment) => {
    setSelectedPayment(payment);
    setIsUpdatePaymentOpen(true);
  };

  return (
    <div className="space-y-2">
      <Browse
        title="Other Payments"
        data={otherPayments}
        columns={OtherPaymentColumns}
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="tertiary"
              title="Add New Payment"
              onClick={() => setIsAddPaymentOpen(true)}
            >
              <Plus className="size-5" />
            </Button>
            <Button
              variant="tertiary"
              title="Refresh"
              onClick={fetchOtherPayments}
            >
              <RefreshCw className="size-5" />
            </Button>
            
          </div>
        }
        rowActions={(rowData) => (
          <Button
            variant="refresh"
            title="Update"
            onClick={() => handleUpdate(rowData as OtherPayment)}
          >
            <SquarePen className="size-4" />
          </Button>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}

      <MiniWindow
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        size="small"
      >
        <AddOtherPayment onClose={() => setIsAddPaymentOpen(false)} />
      </MiniWindow>

      {selectedPayment && (
        <MiniWindow
          isOpen={isUpdatePaymentOpen}
          onClose={() => setIsUpdatePaymentOpen(false)}
          size="small"
        >
          <UpdateOtherPayment
            onClose={() => setIsUpdatePaymentOpen(false)}
            payment={selectedPayment}
          />
        </MiniWindow>
      )}
    </div>
  );
};

export default OtherPayments;
