import { useState, useEffect, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

type Option = {
    label: string;
    value: string;
};

type Employee = {
    firstName: string;
    lastName: string;
    username: string;
};

type SalarySummary = {
    employeeName: string;
    username: string;
    perDayAmount: number;
    totalSalary: number;
    presentDays: number;
    workingDays: number;
    halfDayDeduction: number;
    lateDeduction: number;
    deductionsTotal: number;
    calculatedSalary: number;
    bonus: number;
    net: number;
    month: string;
    daysInMonth: number;
    totalMonthSalary: number;
    startDate: string;
    endDate: string;
    sandwichedLeaves: number;
    checkIfDone: boolean;
    leaves:number
};

type PendingAdvance = {
    id: number;
    employeeName: string;
    username: string;
    advanceDate: string;
    repayDate: string | null;
    title: string;
    remark: string;
    amount: number;
    status: string;
};

type RepaymentSummary = {
    pendingAdvances: PendingAdvance[];
    totalRemainingAmount: number;
};

type OtherPayment = {
    id: number;
    type: string;
    remark: string;
    amount: number;
    createdAt: string;
    status: string;
    username: string;
    employeeName: string;
    date: string;
};

type OtherPaymentsSummary = {
    otherPayments: OtherPayment[];
    totalAmount: number;
};

export const useSalaryPaymentLogic = () => {
    const { token } = useContext(AuthContext);
    const { showToast } = useToast();

    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [employees, setEmployees] = useState<Option[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [salarySummary, setSalarySummary] = useState<SalarySummary | null>(null);
    const [repaymentSummary, setRepaymentSummary] = useState<RepaymentSummary | null>(null);
    const [otherPaymentsSummary, setOtherPaymentsSummary] = useState<OtherPaymentsSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [deductAdvance, setDeductAdvance] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!selectedEmployee) newErrors.employeeError = "Employee is required";
        if (!selectedMonth) newErrors.monthError = "Month is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchSalarySummary = async (username: string, month: string) => {
        try {
            const payload = {
                username,
                month
            }
            const response = await api(`/admin/salary/monthly-summary`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            if (response.success) {
                setSalarySummary(response.data);
            } else {
                showToast(response.message, "error");
            }
        } catch (e: unknown) {
            const error = e as Error;
            showToast(error.message, "error");
        }
    };

    const fetchRepaymentSummary = async (username: string) => {
        try {
            const response = await api(`/admin/salary/get-repayment-summary/${username}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.success) {
                setRepaymentSummary(response.data);
            } else {
                showToast(response.message, "error");
            }
        } catch (e: unknown) {
            const error = e as Error;
            showToast(error.message, "error");
        }
    };

    const fetchOtherPaymentsSummary = async (username: string, month: string) => {
        try {
            const othersPayload = {
                username,
                month
            }
            const response = await api(`/admin/salary/get-other-payments-summary?username=${username}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(othersPayload),
            });

            if (response.success) {
                setOtherPaymentsSummary(response.data);
            } else {
                showToast(response.message, "error");
            }
        } catch (e: unknown) {
            const error = e as Error;
            showToast(error.message, "error");
        }
    };

    const generateReport = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await Promise.all([
                fetchSalarySummary(selectedEmployee, selectedMonth),
                fetchRepaymentSummary(selectedEmployee),
                fetchOtherPaymentsSummary(selectedEmployee, selectedMonth),
            ]);
        } catch (e: unknown) {
            const error = e as Error;
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch employees for dropdown
    const fetchEmployees = async () => {
        try {
            const response = await api("/admin/getAllEmployees", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.success) {
                const mapped = response.data.map((user: Employee) => ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.username,
                }));
                setEmployees(mapped);
            } else {
                showToast(response.message, "error");
            }
        } catch (e: unknown) {
            const error = e as Error;
            showToast(error.message, "error");
        }
    };

    const handlePayConfirm = async () => {
        const netSalaryAmount = salarySummary!.net - (deductAdvance ? repaymentSummary?.totalRemainingAmount || 0 : 0);
        try {
            const payload = {
                id: null,
                username: salarySummary!.username,
                employeeName: salarySummary!.employeeName,
                salaryMonth: salarySummary!.month.toString(),
                grossSalary: salarySummary!.totalMonthSalary,
                otherPaymentsTotal: otherPaymentsSummary?.totalAmount,
                advanceTotal: deductAdvance ? repaymentSummary?.totalRemainingAmount : 0,
                netSalary: netSalaryAmount,
                startDate: salarySummary!.startDate,
                endDate: salarySummary!.endDate,
            };

            const res = await api("/admin/salary/logs/add", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (deductAdvance) {
                updateAdvanceStatus();
            }

            showToast(res.message || "Salary marked as paid", "success");
            setPopupOpen(false);
        } catch (err: unknown) {
            const message = err?.message || "Failed to mark salary as paid";
            showToast(message, "error");
        }
    };

    const updateAdvanceStatus = async () => {
        if (!repaymentSummary || repaymentSummary.pendingAdvances.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const updatePromises = repaymentSummary.pendingAdvances.map(advance => {
                const payload = {
                    ...advance,
                    status: "REPAYED",
                    repayDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
                };

                return api(`/admin/salary/advances/${payload.id}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            });

            const results = await Promise.all(updatePromises);

            results.forEach(res => {
                if (res.success) {
                    showToast(res.message || "Advance status updated.", "success");
                } else {
                    showToast(res.message || "Failed to update an advance.", "error");
                }
            });

        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred while updating advances.";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return {
        selectedEmployee,
        setSelectedEmployee,
        selectedMonth,
        setSelectedMonth,
        employees,
        errors,
        validate,
        salarySummary,
        repaymentSummary,
        otherPaymentsSummary,
        loading,
        generateReport,
        handlePayConfirm,
        popupOpen, setPopupOpen,
        deductAdvance, setDeductAdvance,
        updateAdvanceStatus
    };
};
