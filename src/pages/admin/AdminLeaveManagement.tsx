import React, { useState } from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import { Check, RefreshCcw, X } from "lucide-react";
import Loader from "../../components/Loader";
import MiniWindow from "../../components/MiniWindow";
import Form from "../../components/Form";
import { useAdminLeaveManagement } from "./AdminLeaveManagement.hooks";

const AdminLeaveManagement = () => {
  const {
    leaves,
    LeaveColumnHeaders,
    loading,
    handleGetAllLeaves,
    handleUpdateLeaveStatus,
    selectedLeave,
    setSelectedLeave,
    isOpenReject,
    setIsOpenReject,
  } = useAdminLeaveManagement();

  const [rejectionMsg, setRejectionMsg] = useState("");

  return (
    <div className="space-y-2">
      <Browse
        title="All Leaves"
        data={leaves}
        columns={LeaveColumnHeaders}
        rowActions={(row) => (
          <div className="flex gap-2">
            {/* Approve button */}
            <Button
            disabled={row.status === "APPROVED"}
              variant="safe"
              title="Approve"
              onClick={() => handleUpdateLeaveStatus(row.id, "APPROVED")}
            >
              <Check className="size-4" />
            </Button>

            {/* Reject button */}
            <Button
            disabled={row.status === "REJECTED"}
              variant="danger"
              title="Reject"
              onClick={() => {
                setSelectedLeave(row);
                setIsOpenReject(true);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
        headerActions={
          <div className="space-x-2">
            {/* Refresh Button */}
            <Button
              variant="tertiary"
              title="Refresh"
              onClick={handleGetAllLeaves}
            >
              <RefreshCcw className="size-5" />
            </Button>
          </div>
        }
      />


      {loading && (
        <Loader fullScreen />
      )}

      {/* Reject reason popup */}
      <MiniWindow
        isOpen={isOpenReject}
        onClose={() => setIsOpenReject(false)}
        size="small"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedLeave) {
              handleUpdateLeaveStatus(selectedLeave.id, "REJECTED", rejectionMsg);
              setRejectionMsg("");
            }
          }}
          className="space-y-4"
        >
          <Form
            fields={[
              {
                type: "text",
                name: "rejectionMsg",
                label: "Rejection Reason",
                value: rejectionMsg,
                onChange: setRejectionMsg,
                placeholder: "Enter reason for rejection",
              },
            ]}
          />

          <Button type="submit" variant="danger" className="w-full">
            Reject Leave
          </Button>
        </form>
      </MiniWindow>
    </div>
  );
};

export default AdminLeaveManagement;
