import React, { useState } from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import { Check, FileX, RefreshCcw } from "lucide-react";
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
        selectable={true}
        headerActions={(selectedRows) => (
          <div className="space-x-2">
            {/* Approve button */}
            <Button
              variant="tertiary"
              title="Approve"
              disabled={
                selectedRows.length !== 1 || selectedRows[0].status !== "PENDING"
              }
              onClick={() =>
                handleUpdateLeaveStatus(selectedRows[0].id, "APPROVED")
              }
            >
              <Check className="size-5" />
            </Button>

            {/* Reject button */}
            <Button
              variant="tertiary"
              title="Reject"
              disabled={
                selectedRows.length !== 1 || selectedRows[0].status !== "PENDING"
              }
              onClick={() => {
                setSelectedLeave(selectedRows[0]);
                setIsOpenReject(true);
              }}
            >
              <FileX className="size-5" />
            </Button>

            {/* Refresh button */}
            <Button variant="tertiary" title="Refresh" onClick={handleGetAllLeaves}>
              <RefreshCcw className="size-5" />
            </Button>
          </div>
        )}
      />

      {loading && (
        <div className="flex items-center justify-center bg-light">
          <Loader size={48} color="text-primary" />
        </div>
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
