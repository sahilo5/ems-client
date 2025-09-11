import React, { useState } from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import { Edit, FileX, Plus, RefreshCcw } from "lucide-react";
import MiniWindow from "../../components/MiniWindow";
import Loader from "../../components/Loader";
import { useEmployeeLeaveManagement } from "./EmployeeLeaveManagement.hooks";
import Dropdown from "../../components/Dropdown";
import DateSelector from "../../components/DateSelector";
import Form from "../../components/Form";
import Popup from "../../components/Popup";

const EmployeeLeaveManagement = () => {
  const {
    leaves,
    LeaveColumnHeaders,
    loading,
    handleGetMyLeaves,
    handleApplyLeave,
    handleUpdateLeave,
    handleDeleteLeave,
    isOpen,
    setIsOpen,
    selectedLeave,
    setSelectedLeave,
  } = useEmployeeLeaveManagement();

  // MiniWindow state
  const [openApply, setOpenApply] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Form state
  const [type, setType] = useState("SICK");
  const [reason, setReason] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  // Apply leave with validation
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !reason || !dates.length || !description) {
      alert("All fields are required!");
      return;
    }

    const success = await handleApplyLeave({ type, reason, dates, description });
    if (success) {
      setOpenApply(false);
      setReason("");
      setDates([]);
      setDescription("");
    }
  };

  // Update leave
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeave) return;

    const updatedLeave = {
      ...selectedLeave,
      type,
      reason,
      dates,
      description,
    };

    const success = await handleUpdateLeave(updatedLeave);
    if (success) {
      setOpenEdit(false);
      setSelectedLeave(null);
    }
  };

  return (
    <div className="space-y-2">
      <Browse
        title="My Leaves"
        data={leaves}
        columns={LeaveColumnHeaders}
        selectable={true}
        headerActions={(selectedRows) => (
          <div className="space-x-2">
            {/* Edit Button */}
            <Button
              variant="tertiary"
              title="Edit"
              disabled={selectedRows.length !== 1 || selectedRows[0].status !== "PENDING"}
              onClick={() => {
                setSelectedLeave(selectedRows[0]);
                setType(selectedRows[0].type);
                setReason(selectedRows[0].reason);
                setDates(selectedRows[0].dates);
                setDescription(selectedRows[0].description);
                setOpenEdit(true);
              }}
            >
              <span><Edit className="size-5" /></span>
            </Button>

            {/* Apply Button */}
            <Button variant="tertiary" title="Apply Leave" onClick={() => setOpenApply(true)}>
              <span><Plus className="size-5" /></span>
            </Button>

            {/* Delete Button */}
            <Button
              variant="tertiary"
              title="Delete"
              disabled={selectedRows.length < 1 || selectedRows.some((row) => row.status !== "PENDING")}
              onClick={() => {
                setIsOpen(true);
                setSelectedLeave(selectedRows[0]);
              }}
            >
              <span><FileX className="size-5" /></span>
            </Button>

            {/* Refresh Button */}
            <Button variant="tertiary" title="Refresh" onClick={handleGetMyLeaves}>
              <span><RefreshCcw className="size-5" /></span>
            </Button>
          </div>
        )}
      />

      {loading && (
        <div className="flex items-center justify-center bg-light">
          <Loader size={48} color="text-primary" />
        </div>
      )}

      {/* Apply Leave MiniWindow */}
      <MiniWindow isOpen={openApply} onClose={() => setOpenApply(false)} size="small">
        <form onSubmit={handleApply} className="space-y-4">
          <Dropdown
            label="Leave Type"
            value={type}
            onChange={setType}
            options={[
              { label: "Sick", value: "SICK" },
              { label: "Casual", value: "CASUAL" },
              { label: "Paid", value: "PAID" },
            ]}
          />

          <Form
            fields={[
              { type: "text", name: "reason", label: "Reason", value: reason, onChange: setReason },
            ]}
          />

          <DateSelector label="Select Dates" value={dates} onChange={setDates} />

          <Form
            fields={[
              { type: "text", name: "description", label: "Description", value: description, onChange: setDescription },
            ]}
          />

          <Button type="submit" variant="primary" className="w-full">
            Apply Leave
          </Button>
        </form>
      </MiniWindow>

      {/* Edit Leave MiniWindow */}
      <MiniWindow isOpen={openEdit} onClose={() => setOpenEdit(false)} size="small">
        <form onSubmit={handleEdit} className="space-y-4">
          <Dropdown
            label="Leave Type"
            value={type}
            onChange={setType}
            options={[
              { label: "Sick", value: "SICK" },
              { label: "Casual", value: "CASUAL" },
              { label: "Paid", value: "PAID" },
            ]}
          />

          <Form
            fields={[
              { type: "text", name: "reason", label: "Reason", value: reason, onChange: setReason },
            ]}
          />

          <DateSelector label="Select Dates" value={dates} onChange={setDates} />

          <Form
            fields={[
              { type: "text", name: "description", label: "Description", value: description, onChange: setDescription },
            ]}
          />

          <Button type="submit" variant="primary" className="w-full">
            Update Leave
          </Button>
        </form>
      </MiniWindow>

      {/* Delete Confirmation Popup */}
      <Popup
        title="Confirm Delete"
        content="Are you sure you want to delete this leave request?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedLeave) handleDeleteLeave(selectedLeave.id, selectedLeave.status);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        variant="confirm"
      />
    </div>
  );
};

export default EmployeeLeaveManagement;
