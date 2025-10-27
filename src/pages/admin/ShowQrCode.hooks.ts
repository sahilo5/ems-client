
import { useEffect, useState, useCallback, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

const REFRESH_INTERVAL = 30000;

export const useShowQrCode = () => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000); // in seconds

  const [permanentLoading, setPermanentLoading] = useState(false);
  const [permanentQrToken, setPermanentQrToken] = useState<string | null>(null);
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
      setQrToken(response.data.qrToken);
      setCountdown(response.data.expiryDuration);
    } catch (err: any) {
      showToast(err.message, "error")
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPermanentQrToken = useCallback(async () => {
    try {
      setPermanentLoading(true);
      const response = await api("/admin/attendance/generate-qr-to-print", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Set the permanent QR token for display in print preview
      setPermanentQrToken(response.data.qrToken);

      // Temporarily show the printable div, print, then hide it
      const printableDiv = document.getElementById('printable-qr');
      if (printableDiv) {
        printableDiv.style.display = 'block';
        setTimeout(() => {
          window.print();
          printableDiv.style.display = 'none';
        }, 100); // Short delay to ensure QR renders
      }
    } catch (err: any) {
      showToast(err.message, "error")
    } finally {
      setPermanentLoading(false);
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

  return { qrToken, loading, countdown, fetchQrToken, permanentLoading, fetchPermanentQrToken, permanentQrToken };
};
