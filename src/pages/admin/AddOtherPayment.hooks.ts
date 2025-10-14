import { useState } from "react";
import { useOtherPayments } from "./OtherPayments.hooks";
import { useToast } from "../../components/ToastProvider";

export const useAddOtherPayment = (onClose: () => void) => {
  const { addOtherPayment, loading } = useOtherPayments();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("BONUS");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.usernameError = "Username is required";
    if (!date) newErrors.advanceDateError = "Payment date is required";
    if (!remark.trim()) newErrors.remarkError = "Remark is required";
    if (!amount.trim() || parseFloat(amount) <= 0)
      newErrors.amountError = "Amount must be greater than zero";
    if (!paymentType) newErrors.paymentTypeError = "Payment type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (validate()) {
      try {
        await addOtherPayment({
          username,
          amount: parseFloat(amount),
          type: paymentType,
          remark,
          date,
        });
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error) {
          showToast(err.message, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
      }
    }
  };

  return {
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
    loading,
    onSubmit,
    errors,
  };
};