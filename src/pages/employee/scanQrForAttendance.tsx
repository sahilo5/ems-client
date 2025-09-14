import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useScanQrForAttendance } from "./scanQrForAttendance.hooks";
import MiniWindow from "../../components/MiniWindow";

interface ScanQrForAttendanceProps {
  onClose: () => void;
}

const ScanQrForAttendance: React.FC<ScanQrForAttendanceProps> = ({ onClose }) => {
  const { scannedData, loading, message, handleScan, handleError } =
    useScanQrForAttendance();
  const [inOrOut, setInOrOut] = useState<"checkin" | "checkout">("checkin");

  return (
    <MiniWindow isOpen={true} onClose={onClose} size="small">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Scan QR for Attendance
        </h2>

        {/* Toggle Check-in / Check-out */}
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg transition ${
              inOrOut === "checkin"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setInOrOut("checkin")}
          >
            Check-In
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition ${
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
        <div className="w-full max-w-sm aspect-square border-2 border-gray-300 rounded-lg overflow-hidden">
          <Scanner
            onScan={(codes) => {
              if (codes.length > 0) {
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
        {loading && (
          <p className="text-blue-500 font-medium">Marking attendance...</p>
        )}
        {message && (
          <p className="text-green-600 font-medium text-center">{message}</p>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    </MiniWindow>
  );
};

export default ScanQrForAttendance;
