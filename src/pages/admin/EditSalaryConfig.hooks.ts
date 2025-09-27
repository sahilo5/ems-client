import { useContext, useState } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { AuthContext } from "../../context/AuthContext";

// remove config.id reference from here
export const useEditSalaryConfig = (onClose: () => void) => {
    const [employeeName, setEmployeeName] = useState("");
    const [id, setId] = useState("");
    const [baseSalary, setBaseSalary] = useState("");
    const [category, setCategory] = useState("JUNIOR");
    const { token } = useContext(AuthContext);
    const { showToast } = useToast();

    const loadConfigData = (config: any) => {
        setId(`${config.id}` || "");
        setEmployeeName(config.employeeName || "");
        setBaseSalary(config.baseSalary?.toString() || "");
        setCategory(config.category || "JUNIOR");
    };

    const handleSubmit = async (configId: string | number) => {
        const payload = {
            id,
            employeeName,
            baseSalary,
            category,
            status: "ACTIVE",
        };

        try {
            const response = await api(`/admin/salary/configs/update`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            showToast(response.message || "Salary config updated successfully", "success");
            onClose();
        } catch (err: any) {
            showToast(err.message || "Failed to update salary config", "error");
        }
    };

    return {
        employeeName,
        category,
        baseSalary,
        setBaseSalary,
        setCategory,
        loadConfigData,
        handleSubmit,
    };
};
