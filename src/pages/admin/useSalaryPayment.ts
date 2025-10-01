// hooks/useSalaryPayment.ts
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { useSalarySummary } from "./SalarySummary.hooks";

export const useSalaryPayment = (
    username: string,
    month: string
) => {
    const { token } = useContext(AuthContext);
    const { showToast } = useToast();

    const handlePayConfirm = async (data: any, onSuccess?: () => void) => {
        if (!data) return;
            try {
                const payload = {
                    username: data.username,
                    payPeriod: data.month,
                    amountPaid: data.net,
                    status: "DONE",
                    remarks: `Salary for ${dayjs(data.month).format("MMMM YYYY")}`,
                };

                const res = await api("/admin/salary/logs/add", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                showToast(res.message || "Salary marked as paid", "success");

                if (onSuccess) onSuccess();
            } catch (err: any) {
                const message = err?.message || "Failed to mark salary as paid";
                showToast(message, "error");
                console.error("Error in handlePayConfirm:", err);
            }
    };


    return { handlePayConfirm };
};
