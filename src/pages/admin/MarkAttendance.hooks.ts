import { useState, useContext, useEffect } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { AuthContext } from "../../context/AuthContext";

type Option = {
  label: string;
  value: string;
};

export const useMarkAttendance = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [employees, setEmployees] = useState<Option[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [mode, setMode] = useState<"mark" | "update">("mark"); // <-- NEW
  const [actionType, setActionType] = useState("checkin");
  const [checkin, setCheckin] = useState(""); // HH:mm
  const [checkout, setCheckout] = useState(""); // HH:mm

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        const mapped = response.data.map((user: any) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.username,
        }));
        setEmployees(mapped);
      } else {
        showToast(response.message, "error");
      }
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Submit API
  const handleAttendance = async (): Promise<boolean> => {
    setLoading(true);
    let response;
    try {

      if (mode === "mark") {
        // MARK API
        const body = {
          username,
          inOrOut: actionType,
        };

        response = await api("/admin/attendance/mark", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

      } else {
        // UPDATE API
        const formatDateTime = (time: string) =>
          time ? `${date}T${time}:00` : null;

        const body: Record<string, any> = {
          username,
          date,
          checkin: formatDateTime(checkin),
          checkout: formatDateTime(checkout),
        };

        response = await api("/admin/attendance/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      if (response.success) {
        showToast(
          mode === "mark"
            ? "Attendance marked successfully!"
            : "Attendance updated successfully!",
          "success"
        );
        setActionType("checkin");
        setCheckin("");
        setCheckout("");
        if (response.success) {
          return true;  
        } else {
          return false;
        }
      } else {
        showToast(response.message, "error");
      }
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.usernameError = "Employee is required";
    if (!date) newErrors.dateError = "Date is required";

    if (mode === "update") {
      if (!checkin && !checkout) {
        newErrors.timeError = "At least one of Check-In or Check-Out required";
      } else {
        // Validate time format HH:MM
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (checkin && !timeRegex.test(checkin)) {
          newErrors.timeError = "Check-In must be in HH:MM format (e.g., 09:00)";
        }
        if (checkout && !timeRegex.test(checkout)) {
          newErrors.timeError = "Check-Out must be in HH:MM format (e.g., 23:18)";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitAttendance = () => {
    if (validate()) {
      return handleAttendance();
    }
    else return false
  };

  return {
    username,
    setUsername,
    employees,
    date,
    setDate,
    mode,
    setMode,
    actionType,
    setActionType,
    checkin,
    setCheckin,
    checkout,
    setCheckout,
    onSubmitAttendance,
    errors,
    loading,
  };
};
