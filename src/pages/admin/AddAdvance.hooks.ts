import { useState } from "react";
import { useToast } from "../../components/ToastProvider";

export const useAddAdvance = (onClose: () => void) => {
  const [configId, setConfigId] = useState("");
  const [advanceDate, setAdvanceDate] = useState("");
  const [title, setTitle] = useState("");
  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!configId.trim()) newErrors.configIdError = "Config ID is required";
    if (!advanceDate) newErrors.advanceDateError = "Advance date is required";
    if (!title.trim()) newErrors.titleError = "Title is required";
    if (!remark.trim()) newErrors.remarkError = "Remark is required";
    if (!amount.trim() || parseFloat(amount) <= 0) newErrors.amountError = "Amount must be greater than zero";
    if (!status) newErrors.statusError = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = () => {
    if (validate()) {
      // Pass data to parent or API call here
      onClose();
      showToast("Advance added (mock)", "success");
    }
  };

  return {
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
  };
};
