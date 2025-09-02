// src/pages/attendance/AttendanceSummary.hooks.tsx
import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type AttendanceDay = {
  date: string; // "YYYY-MM-DD"
  checkIn?: string; // "HH:mm:ss" or "HH:mm"
  checkOut?: string;
  totalHours?: number;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE" | "LEAVE";
};

type Summary = {
  workingDays: number;
  presents: number;
  absents: number;
  halfDays: number;
  lates: number;
  leaves: number;
  totalHours: number;
};

type UseAttendanceCalendarResult = {
  attendanceData: AttendanceDay[];
  summary: Summary;
  loading: boolean;
  month: string; // "YYYY-MM"
  setMonth: (m: string) => void;
  daysInMonth: number;
};

const DEFAULT_RECURRING_HOLIDAYS = [
  "01-26", // Republic Day
  "08-15", // Independence
  "10-02", // Gandhi Jayanti
  "01-01", // New Year
];

export const useAttendanceCalendar = (
  username: string,
  initialMonth?: string,
  recurringHolidayMMDDs: string[] = DEFAULT_RECURRING_HOLIDAYS
): UseAttendanceCalendarResult => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  // month format: "YYYY-MM"
  const defaultMonth = initialMonth ?? dayjs().format("YYYY-MM");
  const [month, setMonth] = useState<string>(defaultMonth);
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState<Summary>({
    workingDays: 0,
    presents: 0,
    absents: 0,
    halfDays: 0,
    lates: 0,
    leaves: 0,
    totalHours: 0,
  });

  const daysInMonth = dayjs(month).daysInMonth();

  // helper: check recurring holiday by MM-DD (works every year)
  const isRecurringHoliday = (dateIso: string) => {
    const mmdd = dayjs(dateIso).format("MM-DD");
    return recurringHolidayMMDDs.includes(mmdd);
  };

  useEffect(() => {
    async function fetchAttendance() {
      if (!username) {
        setAttendanceData([]);
        setSummary({
          workingDays: 0,
          presents: 0,
          absents: 0,
          halfDays: 0,
          lates: 0,
          leaves: 0,
          totalHours: 0,
        });
        return;
      }

      setLoading(true);
      try {
        const start = dayjs(month).startOf("month").format("YYYY-MM-DD");
        const end = dayjs(month).endOf("month").format("YYYY-MM-DD");

        const response = await api("/admin/attendance/summary", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, startDate: start, endDate: end }),
        });

        if (response && response.success) {
          // API returns an array of day objects (for days with records). We'll transform to a map.
          const data: AttendanceDay[] = response.data || [];

          // Normalize: ensure dates are "YYYY-MM-DD"
          const normalized = data.map((d: any) => ({
            date: d.date,
            checkIn: d.checkIn ?? d.checkInTime ?? null,
            checkOut: d.checkOut ?? d.checkOutTime ?? null,
            totalHours: d.totalHours ?? 0,
            status: d.status ?? "PRESENT",
          }));

          setAttendanceData(normalized);

          // Compute stats for the month (we interpret missing days as ABSENT except Sundays/Holidays)
          const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
            dayjs(month).date(i + 1).format("YYYY-MM-DD")
          );

          let presents = 0,
            absents = 0,
            halfDays = 0,
            lates = 0,
            leaves = 0,
            totalHours = 0;

          // make quick lookup map
          const map = new Map<string, AttendanceDay>();
          normalized.forEach((r) => map.set(r.date, r));

          daysArray.forEach((d) => {
            const dayOfWeek = dayjs(d).day(); // 0 Sunday ... 6 Saturday
            if (dayOfWeek === 0 || isRecurringHoliday(d)) {
              // do not count Sundays/holidays as working day (but you can change policy)
              return;
            }
            const rec = map.get(d);
            if (!rec) {
              absents++;
            } else {
              switch (rec.status) {
                case "PRESENT":
                  presents++;
                  break;
                case "HALF_DAY":
                  halfDays++;
                  break;
                case "LATE":
                  lates++;
                  break;
                case "LEAVE":
                  leaves++;
                  break;
                case "ABSENT":
                default:
                  absents++;
              }
              totalHours += rec.totalHours ?? 0;
            }
          });

          const workingDays = dayjs(month).daysInMonth() - // number of days
            // subtract Sundays and recurring holidays count in the month
            Array.from({ length: daysInMonth }, (_, i) =>
              dayjs(month).date(i + 1)
            ).filter(
              (d) =>
                d.day() === 0 ||
                recurringHolidayMMDDs.includes(d.format("MM-DD"))
            ).length; // number of non-working days to subtract

          setSummary({
            workingDays,
            presents,
            absents,
            halfDays,
            lates,
            leaves,
            totalHours,
          });
        } else {
          showToast(response?.message || "Failed to fetch attendance", "error");
        }
      } catch (err: any) {
        showToast(err?.message || "Failed to fetch attendance", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, month, daysInMonth]);

  return { attendanceData, summary, loading, month, setMonth, daysInMonth };
};
