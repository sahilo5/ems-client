import React from "react";
import Browse from "../../components/Browse";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Download } from "lucide-react";
import { useAttendanceReports } from "./AttendanceReports.hooks";

const AttendanceReports: React.FC = () => {
  const { attendanceReports, loading, fetchAttendanceReports, exportAttendanceReport, AttendanceReportColumns } = useAttendanceReports();

  return (
    <div className="space-y-2">
      <Browse
        title="Attendance Reports"
        data={attendanceReports}
        columns={AttendanceReportColumns}
        selectable={false}
        headerActions={() => (
          <div className="space-x-2">
            <Button variant="tertiary" title="Export" onClick={exportAttendanceReport}>
              <Download className="size-5" />
            </Button>
          </div>
        )}
      />
      {loading && <Loader size={48} color="text-primary" />}
    </div>
  );
};

export default AttendanceReports;
