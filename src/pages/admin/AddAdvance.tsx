import React from "react";
import Form from "../../components/Form";
import { useAddAdvance } from "./AddAdvance.hooks";
import Button from "../../components/Button";

type AddAdvanceProps = {
  onClose: () => void;
};

const AddAdvance: React.FC<AddAdvanceProps> = ({ onClose }) => {
  const {
    configId,
    setConfigId,
    advanceDate,
    setAdvanceDate,
    title,
    setTitle,
    remark,
    setRemark,
    amount,
    setAmount,
    status,
    setStatus,
    onSubmit,
    errors,
  } = useAddAdvance(onClose);

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Add New Advance</h2>

      {/* Rest of the Form */}
      <Form
        className="mt-4"
        fields={[
          {
            type: "number",
            name: "configId",
            label: "Config ID",
            value: configId,
            onChange: setConfigId,
            error: errors.configIdError,
            placeholder: "Enter config ID",
          },
          {
            type: "date",
            name: "advanceDate",
            label: "Advance Date",
            value: advanceDate,
            onChange: setAdvanceDate,
            error: errors.advanceDateError,
            placeholder: "Select advance date",
          },
          {
            type: "text",
            name: "title",
            label: "Title",
            value: title,
            onChange: setTitle,
            error: errors.titleError,
            placeholder: "Enter advance title",
          },
          {
            type: "text",
            name: "remark",
            label: "Remark",
            value: remark,
            onChange: setRemark,
            error: errors.remarkError,
            placeholder: "Enter remark",
          },
          {
            type: "number",
            name: "amount",
            label: "Amount",
            value: amount,
            onChange: setAmount,
            error: errors.amountError,
            placeholder: "Enter amount",
          },
          {
            type: "dropdown",
            name: "status",
            label: "Status",
            value: status,
            onChange: setStatus,
            error: errors.statusError,
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
            ],
          },
        ]}
      />

      {/* Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={onSubmit} className="w-full">
          Add Advance
        </Button>
      </div>
    </>
  );
};

export default AddAdvance;
