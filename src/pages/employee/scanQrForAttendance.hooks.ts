import { useContext, useState } from "react";
import { api } from "../../utils/api"; // your fetch wrapper
import { AuthContext } from "../../context/AuthContext";

export const useScanQrForAttendance = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  
  const handleScan = async (data: string) => {
    if (!data) return;

    try {
      setLoading(true);
      setScannedData(data);

      // Parse the scanned QR payload (e.g. {"token":"abc123","inOrOut":"checkin"})
      const parsed = JSON.parse(data);

      const response = await api("/user/attendance/mark", {
        method: "POST",
        body: JSON.stringify({
          token: parsed.token,
          inOrOut: parsed.inOrOut,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });

      setMessage(response.message || "Attendance marked successfully");
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      setMessage(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan Error:", err);
    setMessage("QR scanning failed. Please try again.");
  };

  return {
    scannedData,
    loading,
    message,
    handleScan,
    handleError,
  };
};
