import React from "react";
import Form, { FormField } from "../../components/Form";
import { useUpdateOtherPayment } from "./UpdateOtherPayment.hooks";
import { OtherPayment } from "./OtherPayments.hooks";

interface UpdateOtherPaymentProps {
  onClose: () => void;
  payment: OtherPayment;
}

const UpdateOtherPayment: React.FC<UpdateOtherPaymentProps> = ({ onClose, payment }) => {
  const { formData, setFormData, updateOtherPayment, loading } = useUpdateOtherPayment(payment);

  const handleSubmit = async () => {
    await updateOtherPayment();
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
      label: "Date",
      value: formData.date,
      onChange: (value: string) => setFormData({ ...formData, date: value }),
    },
    {
      type: "dropdown",
      name: "type",
      label: "Payment Type",
      value: formData.type,
      onChange: (value: string) => setFormData({ ...formData, type: value }),
      options: [
        { label: "Bonus", value: "BONUS" },
        { label: "Travel", value: "TRAVEL" },
        { label: "Other", value: "OTHER" },
      ],
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
  ];

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? "Updating..." : "Update Payment"}
      disabled={loading}
    />
  );
};

export default UpdateOtherPayment;