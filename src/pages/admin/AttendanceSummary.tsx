// src/pages/attendance/AttendanceCalendar.tsx
import React from "react";
import dayjs from "dayjs";
import { useAttendanceCalendar, AttendanceDay } from "./AttendanceSummary.hooks";

type Props = {
  username: string;
  initialMonth?: string; // "YYYY-MM"
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusColors: Record<string, string> = {
  PRESENT: "bg-green-400",
  ABSENT: "bg-red-400",
  HALF_DAY: "bg-orange-400",
  LATE: "bg-yellow-300",
  LEAVE: "bg-orange-600",
  HOLIDAY: "bg-gray-100",
};

const AttendanceCalendar: React.FC<Props> = ({ username, initialMonth }) => {
  const { attendanceData, summary, loading, month, setMonth, daysInMonth } =
    useAttendanceCalendar(username, initialMonth);

  // map for O(1) lookup
  const recordMap = new Map<string, AttendanceDay>();
  attendanceData.forEach((r) => recordMap.set(r.date, r));

  const startOfMonth = dayjs(month).startOf("month");
  const firstDayIndex = startOfMonth.day(); // 0..6
  const monthName = dayjs(month).format("MMMM YYYY");

  const handleMonthChange = (val: string) => {
    // val is "YYYY-MM"
    setMonth(val);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-10 bg-white border rounded-lg border-white">
      {/* LEFT: Calendar */}
      <div className="w-full md:w-2/3 border-2 rounded-lg p-4 border-accent">
        <div className="flex items-center justify-between mb-3">
          <input
            aria-label="Select month and year"
            className="border rounded px-2 py-1"
            type="month"
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
          />
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
          <div
            className="grid grid-cols-7 gap-2"
            style={{ minWidth: 7 * 84 }} // ensure comfortable width on small screens (cells 84px)
          >
            {/* empty placeholders for starting offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg border bg-white" />
            ))}

            {/* day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dateIso = dayjs(month).date(i + 1).format("YYYY-MM-DD");
              const record = recordMap.get(dateIso);

              // determine status: if record exist => record.status; else if Sunday or recurring holiday => HOLIDAY ; else ABSENT
              const isSunday = dayjs(dateIso).day() === 0;
              const status = record
                ? record.status
                : isSunday
                ? "HOLIDAY"
                : "ABSENT";

              const colorClass = statusColors[status] ?? "bg-white";

              const tooltip = record
                ? `Check-In: ${record.checkIn ?? "-"} | Check-Out: ${
                    record.checkOut ?? "-"
                  } | Hours: ${record.totalHours ?? 0}`
                : isSunday
                ? "Sunday / Holiday"
                : "No record";

              return (
                <div
                  key={dateIso}
                  title={tooltip}
                  className={`h-20 min-h-[72px] rounded-lg cursor-pointer flex flex-col justify-between p-2 text-xl border ${
                    colorClass
                  } hover:brightness-95 transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-md font-semibold">{i + 1}</span>
                  </div>
                  <div className="text-[12px] w-full text-left">
                    <div>{record ? record.status : isSunday ? "Holiday" : "Absent"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Summary */}
      <div className="w-full md:w-1/3 border-2 rounded-lg p-4 bg-white shadow-sm border-accent">
        <h4 className="text-lg font-semibold mb-2">{username}</h4>
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
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
              <div className="p-2 rounded bg-green-50">
                <div className="font-semibold">Present</div>
                <div>{summary.presents}</div>
              </div>
              <div className="p-2 rounded bg-red-50">
                <div className="font-semibold">Absent</div>
                <div>{summary.absents}</div>
              </div>

              <div className="p-2 rounded bg-yellow-50">
                <div className="font-semibold">Late</div>
                <div>{summary.lates}</div>
              </div>
              <div className="p-2 rounded bg-orange-50">
                <div className="font-semibold">Half Days</div>
                <div>{summary.halfDays}</div>
              </div>

              <div className="p-2 rounded bg-orange-100 col-span-2">
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
