import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useScanQrForAttendance } from "./scanQrForAttendance.hooks";

interface ScanQrForAttendanceProps {
  onClose: () => void;
}

const ScanQrForAttendance: React.FC<ScanQrForAttendanceProps> = ({ onClose }) => {
  const { scannedData, loading, message, handleScan, handleError } =
    useScanQrForAttendance();
  const [inOrOut, setInOrOut] = useState<"checkin" | "checkout">("checkin");

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Scan QR for Attendance</h2>

      {/* Check-in / Check-out Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            inOrOut === "checkin"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setInOrOut("checkin")}
        >
          Check-In
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            inOrOut === "checkout"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setInOrOut("checkout")}
        >
          Check-Out
        </button>
      </div>

      {/* QR Scanner */}
      <div className="w-72 h-72 border-2 border-gray-300 rounded-lg overflow-hidden">
        <Scanner
          onScan={(codes) => {
            if (codes.length > 0) {
              // Pass QR token + inOrOut to hook
              handleScan(
                JSON.stringify({
                  token: codes[0].rawValue,
                  inOrOut,
                })
              );
            }
          }}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          scanDelay={500}
        />
      </div>

      {/* Loading / Status */}
      {loading && <p className="mt-4 text-blue-500">Marking attendance...</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Close
      </button>
    </div>
  );
};

export default ScanQrForAttendance;
