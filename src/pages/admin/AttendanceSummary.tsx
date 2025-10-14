// src/pages/attendance/AttendanceCalendar.tsx
import React, { useContext } from "react";
import dayjs from "dayjs";
import { useAttendanceCalendar, AttendanceDay } from "./AttendanceSummary.hooks";
import Loader from "../../components/Loader";
import ThreeDotDropdown from "../../components/ThreeDotDropdown"; // adjust path if needed
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { CompanyContext } from "../../context/CompanyContext";

type Props = {
  username: string;
  initialMonth?: string;
  refreshKey?: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusColors: Record<string, string> = {
  PRESENT: "bg-green-400",
  ABSENT: "bg-red-400",
  HALF_DAY: "bg-orange-400",
  LATE: "bg-yellow-300",
  LEAVE: "bg-orange-600",
  HOLIDAY: "bg-gray-100",
  UNMARKED: "bg-gray-300", 
};

const AttendanceCalendar: React.FC<Props> = ({ username, initialMonth, refreshKey }) => {
  const {
    employeeFullName,
    attendanceData,
    summary,
    loading,
    month,
    setMonth,
    daysInMonth,
    holidays,
    joinDate,
  } = useAttendanceCalendar(username, initialMonth, refreshKey);

  const { companyName } = useContext(CompanyContext);

  const recordMap = new Map<string, AttendanceDay>();
  attendanceData.forEach((r) => recordMap.set(r.date, r));

  const startOfMonth = dayjs(month).startOf("month");
  const firstDayIndex = startOfMonth.day();
  const monthName = dayjs(month).format("MMMM YYYY");
  const today = dayjs();

  const handleMonthChange = (val: string) => setMonth(val);

  // Build normalized calendar rows just like the UI
const buildMonthlyRows = () => {
  const rows: any[] = [];
  const startOfMonth = dayjs(month).startOf("month");
  const endOfMonth = dayjs(month).endOf("month");

  for (let d = startOfMonth; d.isBefore(endOfMonth) || d.isSame(endOfMonth, "day"); d = d.add(1, "day")) {
    const dateIso = d.format("YYYY-MM-DD");
    const record = recordMap.get(dateIso);

    const isSunday = d.day() === 0;
    const holiday = holidays.find((h) => h.date === dateIso);
    const beforeJoin = joinDate && d.isBefore(dayjs(joinDate), "day");
    const afterToday = d.isAfter(today, "day");

    let status: string;
    if (beforeJoin) status = "Not Joined";
    else if (afterToday) status = "Upcoming";
    else if (record) status = record.status;
    else if (isSunday || holiday) status = holiday ? `Holiday: ${holiday.name}` : "Holiday";
    else status = "Absent";

    rows.push({
      Date: dateIso,
      "Check-In": record?.checkIn || "-",
      "Check-Out": record?.checkOut || "-",
      Hours: record?.totalHours || 0,
      Status: status,
    });
  }
  return rows;
};

const buildYearlyRows = () => {
  const year = dayjs(month).year();
  const rows: any[] = [];

  // Monthly summary per month
  for (let m = 0; m < 12; m++) {
    const monthStr = dayjs().year(year).month(m).format("YYYY-MM");
    // Filter data for this month only
    const monthRecords = attendanceData.filter((r) => r.date.startsWith(monthStr));

    const presents = monthRecords.filter((r) => r.status === "PRESENT").length;
    const absents = monthRecords.filter((r) => r.status === "ABSENT").length;
    const halfDays = monthRecords.filter((r) => r.status === "HALF_DAY").length;
    const lates = monthRecords.filter((r) => r.status === "LATE").length;
    const leaves = monthRecords.filter((r) => r.status === "LEAVE").length;
    const totalHours = monthRecords.reduce((acc, r) => acc + (r.totalHours || 0), 0);

    rows.push({
      Month: dayjs(monthStr).format("MMMM YYYY"),
      Present: presents,
      Absent: absents,
      "Half Days": halfDays,
      Late: lates,
      Leaves: leaves,
      Hours: totalHours,
    });
  }

  return rows;
};

  // --------- EXPORT HELPERS ----------
  const exportPDF = (scope: "month" | "year") => {
    const doc = new jsPDF();
    const reportTitle =
      scope === "month"
        ? `Attendance Report - ${monthName}`
        : `Attendance Report - Year ${dayjs(month).year()}`;
  
    doc.setFontSize(18);
    doc.text(companyName || "Your Company Name", 14, 15);
    doc.setFontSize(12);
    doc.text(reportTitle, 14, 25);
    doc.text(`Employee: ${employeeFullName}`, 14, 35);
    doc.text(`Generated: ${today.format("DD MMM YYYY")}`, 150, 35);
  
    if (scope === "month") {
      const rows = buildMonthlyRows();
      autoTable(doc, {
        head: [["Date", "Check-In", "Check-Out", "Hours", "Status"]],
        body: rows.map((r) => [r.Date, r["Check-In"], r["Check-Out"], r.Hours, r.Status]),
        startY: 45,
      });
    } else {
      const rows = buildYearlyRows();
      autoTable(doc, {
        head: [["Month", "Present", "Absent", "Half Days", "Late", "Leaves", "Hours"]],
        body: rows.map((r) => [
          r.Month,
          r.Present,
          r.Absent,
          r["Half Days"],
          r.Late,
          r.Leaves,
          r.Hours,
        ]),
        startY: 45,
      });
    }
  
    doc.save(`${employeeFullName}_${scope}_attendance.pdf`);
  };
  
  const exportExcel = (scope: "month" | "year") => {
    const rows = scope === "month" ? buildMonthlyRows() : buildYearlyRows();
    const ws = XLSX.utils.json_to_sheet(rows);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      scope === "month" ? monthName : `Year ${dayjs(month).year()}`
    );
    XLSX.writeFile(wb, `${employeeFullName}_${scope}_attendance.xlsx`);
  };  

  const dropdownOptions = [
    { label: "Download Monthly PDF", onClick: () => exportPDF("month") },
    { label: "Download Monthly Excel", onClick: () => exportExcel("month") },
    { label: "Download Yearly PDF", onClick: () => exportPDF("year") },
    { label: "Download Yearly Excel", onClick: () => exportExcel("year") },
  ];
  

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6 backdrop-blur-lg bg-white/30 border rounded-lg border-white">
      {/* LEFT: Calendar */}
      <div className="w-full md:w-2/3 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <input
            aria-label="Select month and year"
            className="border rounded px-2 py-1"
            type="month"
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
          />

          {/* Three-dot menu */}
          <ThreeDotDropdown options={dropdownOptions} />

        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-xs text-center font-medium text-gray-600">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="mt-2 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2" style={{ minWidth: 7 * 84 }}>
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg border bg-white/50" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dateIso = dayjs(month).date(i + 1).format("YYYY-MM-DD");
              const record = recordMap.get(dateIso);

              const isSunday = dayjs(dateIso).day() === 0;
              const holiday = holidays.find((h) => h.date === dateIso);
              const beforeJoin =
                joinDate && dayjs(dateIso).isBefore(dayjs(joinDate), "day");
              const afterToday = dayjs(dateIso).isAfter(today, "day");

              let status: string;
              if (beforeJoin || afterToday) status = "UNMARKED";
              else if (isSunday || holiday) status = "SUNDAY";
              else if (record) status = record.status;
              else status = "ABSENT";

              const colorClass = statusColors[status] ?? "bg-white/50";
              const tooltip = record
                ? `Check-In: ${record.checkIn ?? "-"} | Check-Out: ${record.checkOut ?? "-"
                } | Hours: ${record.totalHours ?? 0}`
                : isSunday
                  ? "Sunday / Holiday"
                  : holiday
                    ? holiday.name
                    : "No record";

              return (
                <div
                  key={dateIso}
                  title={tooltip}
                  className={`h-20 min-h-[72px] rounded-lg cursor-pointer flex flex-col justify-between p-2 text-xl border ${colorClass}`}
                >
                  <span className="text-md font-semibold">{i + 1}</span>
                  <span className="text-[12px]">
                    {record?.status ||
                      (holiday ? holiday.name : beforeJoin ? "Not Joined" : afterToday ? "Upcoming" : status)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Summary */}
      <div className="w-full md:w-1/3  rounded-lg p-4  ">
        <h4 className="text-lg font-semibold mb-2">{employeeFullName}</h4>
        {loading ? (
          <div className="flex items-center justify-center bg-light">
            <Loader size={48} color="text-primary" />
          </div>
        ) : (
          <>
            <div className="text-sm mb-3">
              <div>
                <strong>Working days (this month):</strong> {summary.workingDays}
              </div>
              <div>
                <strong>Total hours:</strong> {summary.totalHours} hrs
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-green-50 border-1 border-green-200 shadow-md hover:bg-green-100">
                <div className="font-semibold">Present</div>
                <div>{summary.presents}</div>
              </div>
              <div className="p-2 rounded bg-red-50 border-1 border-red-200 shadow-sm hover:bg-red-100">
                <div className="font-semibold">Absent</div>
                <div>{summary.absents}</div>
              </div>
              <div className="p-2 rounded bg-yellow-50 border-1 border-yellow-200 shadow-sm hover:bg-yellow-100">
                <div className="font-semibold">Late</div>
                <div>{summary.lates}</div>
              </div>
              <div className="p-2 rounded bg-orange-50 border-1 border-orange-200 shadow-sm hover:bg-orange-100">
                <div className="font-semibold">Half Days</div>
                <div>{summary.halfDays}</div>
              </div>
              <div className="p-2 rounded bg-red-100 col-span-2 border-1 border-red-300 shadow-sm hover:bg-red-200">
                <div className="font-semibold">Leaves</div>
                <div>{summary.leaves}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
