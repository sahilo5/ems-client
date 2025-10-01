import { useContext, useEffect, useState, useCallback } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { AuthContext } from "../../context/AuthContext";

export const useSalarySummary = (username: string, month: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkIfDone, setCheckIfDone] = useState<boolean>(false);

  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const checkStatus = useCallback(async () => {
    if (!username || !month) {
      setCheckIfDone(false);
      return;
    }

    try {
      const res = await api("/admin/salary/by-user-month", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, salaryMonth: month }),
      });
      
      const payload = res?.data ?? res;
      if (Array.isArray(payload) && payload.length > 0) {
        const paid = payload.some(
          (log: any) =>
            log.status === "DONE" ||
            log.paid === true 
        );
        setCheckIfDone(Boolean(paid));
      } else {
        setCheckIfDone(false);
      }
    } catch (err: any) {
      const message = err?.message || "Failed to check salary status";
      showToast(message, "error");
      setCheckIfDone(false);
    }
  }, [username, month, token, showToast]);

  const fetchMonthData = useCallback(async () => {
    if (!username || !month) {
      setData(null);
      setCheckIfDone(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api("/admin/salary/monthly-summary", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, month }),
      });

      const payload = res?.data ?? res;
      if (res?.success === false || !payload) {
        setData(null);
        showToast("No data found for this month", "error");
        setCheckIfDone(false);
      } else {
        setData(payload);
        await checkStatus();
      }
    } catch (err: any) {
      setData(null);
      showToast(err?.message || "Failed to fetch monthly salary summary", "error");
      setCheckIfDone(false);
    } finally {
      setLoading(false);
    }
  }, [username, month, token, showToast, checkStatus]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  return { data, loading, fetchMonthData, checkIfDone };
};


export const useYearlySalarySummary = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const fetchYearData = useCallback(
    async (username: string, year: number) => {
      if (!username || !year) {
        showToast("Invalid input for yearly summary", "error");
        return null;
      }

      try {
        const res = await api("/admin/salary/yearly-summary", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username, year }),
        });

        const payload = res?.data ?? res;
        if (!payload) {
          showToast("No yearly data found", "error");
          return null;
        }
        return payload;
      } catch (err: any) {
        showToast(err?.message || "Failed to fetch yearly salary summary", "error");
        return null;
      }
    },
    [token, showToast]
  );

  return { fetchYearData };
};
