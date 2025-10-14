import React from "react";
import Form, { FormField } from "../../components/Form";
import { useUpdateAdvance } from "./UpdateAdvance.hooks";
import { Advance } from "./Advances.hooks";

interface UpdateAdvanceProps {
  onClose: () => void;
  advance: Advance;
}

const UpdateAdvance: React.FC<UpdateAdvanceProps> = ({ onClose, advance }) => {
  const { formData, setFormData, updateAdvance, loading } = useUpdateAdvance(advance);

  const handleSubmit = async () => {
    await updateAdvance();
    onClose();
  };

  const fields: FormField[] = [
    {
      type: "text",
      name: "username",
      label: "Username",
      value: formData.username,
      onChange: (value: string) => setFormData({ ...formData, username: value }),
      disabled: true,
    },
    {
      type: "date",
      name: "advanceDate",
      label: "Advance Date",
      value: formData.advanceDate,
      onChange: (value: string) => setFormData({ ...formData, advanceDate: value }),
    },
    {
      type: "text",
      name: "title",
      label: "Title",
      value: formData.title,
      onChange: (value: string) => setFormData({ ...formData, title: value }),
    },
    {
      type: "text",
      name: "remark",
      label: "Remark",
      value: formData.remark,
      onChange: (value: string) => setFormData({ ...formData, remark: value }),
    },
    {
      type: "number",
      name: "amount",
      label: "Amount",
      value: formData.amount.toString(),
      onChange: (value: string) => setFormData({ ...formData, amount: parseFloat(value) }),
    },
    {
      type: "text",
      name: "status",
      label: "Status",
      value: formData.status,
      onChange: (value: string) => setFormData({ ...formData, status: value }),
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