import { useState } from "react";
import { useToast } from "../../components/ToastProvider";
import { api } from "../../utils/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const useAddAdvance = (onClose: () => void) => {
  const { token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [advanceDate, setAdvanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.usernameError = "Username is required";
    if (!advanceDate) newErrors.advanceDateError = "Advance date is required";
    if (!title.trim()) newErrors.titleError = "Title is required";
    if (!remark.trim()) newErrors.remarkError = "Remark is required";
    if (!amount.trim() || parseFloat(amount) <= 0) newErrors.amountError = "Amount must be greater than zero";
    if (!status) newErrors.statusError = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (validate()) {
      try {
        const payload = {
          username,
          advanceDate,
          title,
          remark,
          amount: parseFloat(amount),
          status,
        };
        const res = await api("/admin/salary/advances", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (res.success) {
          showToast("Advance added successfully", "success");
          onClose();
        } else {
          showToast(res.message, "error");
        }
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }
  };

  return {
    username,
    setUsername,
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
