// pages/admin/ShowQrCode.tsx
import React from "react";
import QRCode from "react-qr-code";
import Button from "../../components/Button";
import { useShowQrCode } from "./ShowQrCode.hooks";
import Loader from "../../components/Loader";

const ShowQrCode = () => {
  const { qrToken, loading, fetchQrToken,countdown } = useShowQrCode();

  return (
    <div className="flex flex-col items-center justify-center bg-light w-full p-8 border border-light">
      <h2 className="text-2xl font-bold text-dark mb-4">Attendance QR Code</h2>

      <div className="text-center">
      {loading && (
              <div className="flex items-center justify-center bg-light">
                <Loader size={48} color="text-primary" />
              </div>
            )}
      {qrToken && (
        <>
          <p className="text-sm text-gray-500">
            Refreshing in <b>{countdown}</b> seconds
          </p>
        </>
      )}
    </div>

    {qrToken ? (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <QRCode value={qrToken} size={200} />
        </div>
    ) : (
        <p className="text-red-500">Failed to load QR</p>
    )}

      <div className="mt-6 flex gap-4">
        <Button variant="primary" onClick={fetchQrToken}>
          Refresh Now
        </Button>
      </div>

    </div>
  );
};

export default ShowQrCode;
