
import { useEffect, useState, useCallback, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { INTERVAL_FOR_QR } from "../../constants";
import { useToast } from "../../components/ToastProvider";

const REFRESH_INTERVAL = INTERVAL_FOR_QR; 

export const useShowQrCode = () => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000); // in seconds
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const fetchQrToken = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api("/admin/attendance/generate-qr", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setQrToken(response.data); // backend sends ApiResponse<T>
      setCountdown(REFRESH_INTERVAL / 1000); // reset countdown after refresh
    } catch (err: any) {
      showToast(err.message,"error")
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Initial fetch
    fetchQrToken();

    // Countdown timer (runs every second)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchQrToken(); // refresh when timer hits 0
          return REFRESH_INTERVAL / 1000; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchQrToken]);

  return { qrToken, loading, countdown, fetchQrToken };
};
