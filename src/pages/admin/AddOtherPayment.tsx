import React from "react";
import Form from "../../components/Form";
import { useAddOtherPayment } from "./AddOtherPayment.hooks";
import Button from "../../components/Button";
import { useSalaryManagement } from "./SalaryManagement.hooks";

type AddOtherPaymentProps = {
  onClose: () => void;
};

const AddOtherPayment: React.FC<AddOtherPaymentProps> = ({ onClose }) => {
  const { configs } = useSalaryManagement();
  const {
    username,
    setUsername,
    amount,
    setAmount,
    paymentType,
    setPaymentType,
    remark,
    setRemark,
    date,
    setDate,
    onSubmit,
    errors,
  } = useAddOtherPayment(onClose);

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Add Other Payment</h2>

      <Form
        className="mt-4"
        fields={[
          {
            type: "dropdown",
            name: "username",
            label: "Employee",
            value: username,
            onChange: setUsername,
            error: errors.usernameError,
            options: configs.map((c) => ({
              label: c.employeeName,
              value: c.username,
            })),
          },
          {
            type: "date",
            name: "paymentDate",
            label: "Payment Date",
            value: date,
            onChange: setDate,
            error: errors.advanceDateError,
            placeholder: "Select payment date",
          },
          {
            type: "dropdown",
            name: "paymentType",
            label: "Payment Type",
            value: paymentType,
            onChange: setPaymentType,
            error: errors.paymentTypeError,
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
        ]}
      />

      <div className="mt-6 flex justify-between space-x-4">
        <Button variant="primary" onClick={onSubmit} className="w-full">
          Add Payment
        </Button>
      </div>
    </>
  );
};

export default AddOtherPayment;