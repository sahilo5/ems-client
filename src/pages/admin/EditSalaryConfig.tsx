import React, { useEffect } from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { useEditSalaryConfig } from "./EditSalaryConfig.hooks";

type EditSalaryConfigProps = {
    config: any;          // passed from SalaryManagement (selected row)
    onClose: () => void;  // to close modal
};

const EditSalaryConfig: React.FC<EditSalaryConfigProps> = ({ config, onClose }) => {
    const {
        employeeName,
        category,
        baseSalary,
        setBaseSalary,
        setCategory,
        loadConfigData,
        handleSubmit,
    } = useEditSalaryConfig(onClose);

    // load data when modal opens
    useEffect(() => {
        if (config) {
            loadConfigData(config);
        }
    }, [config]);

    return (
        <>
            <h2 className="text-2xl font-bold text-center mb-6 text-dark">
                Edit Salary Config
            </h2>

            <Form
                className="mt-4"
                fields={[
                    {
                        type: "text",
                        name: "employeeName",
                        label: "Employee Name",
                        value: employeeName,
                        placeholder: "Employee Name",
                        disabled: true,
                        onChange: () => { }, // required but unused
                    },
                    {
                        type: "number",
                        name: "baseAmount",
                        label: "Base Amount",
                        value: baseSalary,
                        onChange: setBaseSalary,
                        placeholder: "Enter base salary",
                    },
                    {
                        type: "dropdown",
                        name: "salaryTier",
                        label: "Salary Tier",
                        value: category,
                        onChange: setCategory,
                        options: [
                            { value: "INTERN", label: "Intern" },
                            { value: "JUNIOR", label: "Junior" },
                            { value: "MID_LEVEL", label: "Mid level" },
                            { value: "SENIOR", label: "Senior" },
                            { value: "LEAD", label: "Lead" },
                            { value: "MANAGER", label: "Manager" },
                        ],
                    },
                    {
                        type: "text",
                        name: "status",
                        label: "Status",
                        value: "Active",
                        disabled: true,
                        onChange: () => { }, // required but unused
                    },
                ]}
            />

            <div className="mt-6 flex justify-between space-x-4">
                <Button
                    variant="primary"
                    onClick={() => handleSubmit(config.id)}
                    className="w-full"
                >
                    Save Changes
                </Button>
                <Button variant="secondary" onClick={onClose} className="w-full">
                    Cancel
                </Button>
            </div>
        </>
    );
};

export default EditSalaryConfig;
