// pages/admin/ShowQrCode.tsx
import React from "react";
import QRCode from "react-qr-code";
import Button from "../../components/Button";
import { useShowQrCode } from "./ShowQrCode.hooks";
import Loader from "../../components/Loader";

const ShowQrCode = () => {
  const { qrToken, loading, fetchQrToken, countdown, permanentLoading, fetchPermanentQrToken, permanentQrToken } = useShowQrCode();

  return (
    <div className="flex flex-col items-center justify-center w-full p-8 backdrop-blur-lg bg-white/40 text-dark  border-1 border-white rounded-lg shadow-inner shadow-white/50">
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
        <div className="p-4 bg-white/80 border-2 border-white rounded-xl shadow-md">
          <QRCode value={qrToken} size={200} />
        </div>
      ) : (
        <p className="text-red-500">Failed to load QR</p>
      )}

      {permanentLoading && (
        <Loader fullScreen />
      )}

      {/* Hidden printable QR code container */}
      <div id="printable-qr" style={{ display: 'none' }}>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #printable-qr, #printable-qr * { visibility: visible; }
              #printable-qr { position: absolute; left:10%; right:60% width: 100%; height: 100%; display: flex !important; justify-content: center; align-items: center; }
            }
          `}
        </style>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <h2>Permanent QR Code</h2>
          <QRCode value={permanentQrToken || ''} size={300} />
          <p>Valid for 24 hours from generation</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="primary" onClick={fetchQrToken}>
          Refresh Now
        </Button>
        <Button variant="secondary" onClick={fetchPermanentQrToken}>
          Print Permanent QR Code
        </Button>
      </div>

    </div>
  );
};

export default ShowQrCode;
