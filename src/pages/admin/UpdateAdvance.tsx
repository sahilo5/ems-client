import React from "react";
import Form, { FormField } from "../../components/Form";
import { useUpdateAdvance } from "./UpdateAdvance.hooks";
import { Advance } from "./Advances.hooks";

interface UpdateAdvanceProps {
  onClose: () => void;
  advance: Advance;
}

const UpdateAdvance: React.FC<UpdateAdvanceProps> = ({ onClose, advance }) => {
  const { formData, setFormData, updateAdvance, loading, errors } = useUpdateAdvance(advance);

  const handleSubmit = async () => {
    await updateAdvance();
    onClose();
  };

  const fields: FormField[] = [
    {
      type: "text",
      name: "employeeName",
      label: "Employee Name",
      value: formData.employeeName,
      onChange: (value: string) => setFormData({ ...formData, employeeName: value }),
      disabled: true,
    },
    {
      type: "date",
      name: "advanceDate",
      label: "Advance Date",
      value: formData.advanceDate,
      onChange: (value: string) => setFormData({ ...formData, advanceDate: value }),
      error: errors.advanceDateError,
    },
    {
      type: "text",
      name: "title",
      label: "Title",
      value: formData.title,
      onChange: (value: string) => setFormData({ ...formData, title: value }),
      error: errors.titleError,
    },
    {
      type: "text",
      name: "remark",
      label: "Remark",
      value: formData.remark,
      onChange: (value: string) => setFormData({ ...formData, remark: value }),
      error: errors.remarkError,
    },
    {
      type: "number",
      name: "amount",
      label: "Amount",
      value: formData.amount.toString(),
      onChange: (value: string) => setFormData({ ...formData, amount: parseFloat(value) }),
      error: errors.amountError,
    },
    {
      type: "dropdown",
      name: "status",
      label: "Status",
      value: formData.status,
      onChange: (value: string) => setFormData({ ...formData, status: value }),
      error: errors.statusError,
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Repayed", value: "REPAYED" },
      ],
    },
  ];

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? "Updating..." : "Update Advance"}
      disabled={loading}
    />
  );
};

export default UpdateAdvance;