import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useToast } from "../../components/ToastProvider";

export type AttendanceDay = {
  date: string; // "YYYY-MM-DD"
  checkIn?: string | null;
  checkOut?: string | null;
  totalHours?: number;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE" | "LEAVE"| "PAID_LEAVE";
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

type Holiday = { date: string; name: string };

type UseAttendanceCalendarResult = {
  employeeFullName: string;
  attendanceData: AttendanceDay[];
  summary: Summary;
  loading: boolean;
  month: string;
  setMonth: (m: string) => void;
  daysInMonth: number;
  holidays: Holiday[];
  joinDate: string | null; // NEW: employee joining date (YYYY-MM-DD) if available
};

export const useAttendanceCalendar = (
  username: string,
  initialMonth?: string,
  refreshKey?: number
): UseAttendanceCalendarResult => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const defaultMonth = initialMonth ?? dayjs().format("YYYY-MM");
  const [month, setMonth] = useState<string>(defaultMonth);
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeFullName, setEmployeeFullName] = useState("");
  const [joinDate, setJoinDate] = useState<string | null>(null);

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

  /** fetch holidays from settings (existing behaviour, kept) */
  const fetchHolidays = async () => {
    try {
      const res = await api("/user/settings/1", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res?.success && res.data?.data) {
        try {
          const parsed: Holiday[] = JSON.parse(res.data.data);
          setHolidays(parsed);
        } catch {
          setHolidays([]);
        }
      }
    } catch (err) {
      showToast((err as Error)?.message || "Failed to fetch holidays", "error");
    }
  };

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setJoinDate(null);
        setEmployeeFullName("");
        return;
      }

      setLoading(true);

      // --- Fetch employee full name and join date in parallel ---
      let fullNameResp: any = null;
      let joinResp: any = null;

      try {
        fullNameResp = await api(`/user/fullName/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch {
        // ignore, will fallback to username
      }

      try {
        joinResp = await api(`/admin/employee-since/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch {
        // ignore, join date might be missing
      }

      // robust parsing of full name response
      try {
        let nameStr = "";
        if (fullNameResp) {
          if (fullNameResp?.data && typeof fullNameResp.data === "object") {
            const d = fullNameResp.data;
            nameStr =
              (d.firstName ? `${d.firstName}` : "") +
              (d.lastName ? ` ${d.lastName}` : "");
            nameStr = nameStr.trim() || d.fullName || "";
          } else if (typeof fullNameResp?.data === "string") {
            nameStr = fullNameResp.data;
          } else if (fullNameResp?.firstName || fullNameResp?.lastName) {
            nameStr =
              `${fullNameResp.firstName || ""} ${fullNameResp.lastName || ""}`.trim();
          }
        }
        setEmployeeFullName(nameStr || username);
      } catch {
        setEmployeeFullName(username);
      }

      // robust parsing of join date
      let parsedJoin: dayjs.Dayjs | null = null;
      try {
        if (joinResp && joinResp.success) {
          // common shapes: joinResp.data (string or object)
          const candidate =
            joinResp.data?.data ?? joinResp.data ?? joinResp?.data?.joinDate ?? null;
          const joinStr =
            typeof candidate === "string" ? candidate : candidate?.date ?? candidate?.joinedOn ?? null;
          if (joinStr) {
            parsedJoin = dayjs(joinStr);
            if (!parsedJoin.isValid()) parsedJoin = null;
          }
        }
      } catch {
        parsedJoin = null;
      }
      const joinStrNormalized = parsedJoin ? parsedJoin.format("YYYY-MM-DD") : null;
      setJoinDate(joinStrNormalized);

      try {
        // determine month boundaries
        const startOfMonth = dayjs(month).startOf("month"); // e.g. 2025-09-01
        const endOfMonth = dayjs(month).endOf("month"); // e.g. 2025-09-30

        // compute effective fetching range: from max(joinDate, startOfMonth) to min(endOfMonth, today)
        const effectiveStart = parsedJoin && parsedJoin.isAfter(startOfMonth)
          ? parsedJoin
          : startOfMonth;

        const effectiveEnd = dayjs().isBefore(endOfMonth) ? dayjs() : endOfMonth;

        // If employee joined after the effective end, nothing to fetch / count
        if (parsedJoin && parsedJoin.isAfter(effectiveEnd, "day")) {
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
          setLoading(false);
          return;
        }

        // format for API
        const start = effectiveStart.format("YYYY-MM-DD");
        const end = effectiveEnd.format("YYYY-MM-DD");

        // fetch attendance only for the effective range
        const response = await api("/admin/attendance/summary", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, startDate: start, endDate: end }),
        });

        if (response && response.success) {
          const data: {
            date: string;
            checkIn?: string | null;
            checkInTime?: string | null;
            checkOut?: string | null;
            checkOutTime?: string | null;
            totalHours?: number;
            status?: "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE" | "LEAVE" |"PAID_LEAVE" ;
          }[] = response.data || [];
          const normalized: AttendanceDay[] = data.map((d) => ({
            date: d.date,
            checkIn: d.checkIn ?? d.checkInTime ?? null,
            checkOut: d.checkOut ?? d.checkOutTime ?? null,
            totalHours: d.totalHours ?? 0,
            status: d.status ?? "PRESENT",
          }));
          setAttendanceData(normalized);

          // compute stats only within [effectiveStart, effectiveEnd]
          const iterStart = effectiveStart.startOf("day");
          const iterEnd = effectiveEnd.startOf("day");
          const daysCount = iterEnd.diff(iterStart, "day") + 1;
          const daysArray = Array.from({ length: Math.max(0, daysCount) }, (_, i) =>
            iterStart.add(i, "day").format("YYYY-MM-DD")
          );

          let presents = 0,
            absents = 0,
            halfDays = 0,
            lates = 0,
            leaves = 0,
            totalHours = 0;

          const map = new Map<string, AttendanceDay>();
          normalized.forEach((r) => map.set(r.date, r));

          daysArray.forEach((d) => {
            const dow = dayjs(d).day();
            const isSunday = dow === 0;
            const isHoliday = holidays.some((h) => h.date === d);

            if (isSunday || isHoliday) return; // skip non-working days

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
                default:
                  absents++;
              }
              totalHours += rec.totalHours ?? 0;
            }
          });

          const leaveDateStrings = normalized
            .filter((d) => d.status === "LEAVE")
            .map((d) => d.date)
            .sort();

          const leaveDates = leaveDateStrings.map((d) => dayjs(d));

          const leavePeriods: { start: dayjs.Dayjs; end: dayjs.Dayjs }[] = [];
          if (leaveDates.length > 0) {
            let periodStart = leaveDates[0];
            let lastDateInPeriod = leaveDates[0];

            for (let i = 1; i < leaveDates.length; i++) {
              const currentDate = leaveDates[i];
              const diff = currentDate.diff(lastDateInPeriod, "day");

              if (diff <= 3) {
                lastDateInPeriod = currentDate;
              } else {
                leavePeriods.push({ start: periodStart, end: lastDateInPeriod });
                periodStart = currentDate;
                lastDateInPeriod = currentDate;
              }
            }
            leavePeriods.push({ start: periodStart, end: lastDateInPeriod });
          }

          const workingDays = daysArray.filter((d) => {
            const day = dayjs(d);
            const isHoliday = holidays.some((h) => h.date === d);
            if (isHoliday) {
              return false;
            }

            const isSunday = day.day() === 0;
            if (isSunday) {
              const isDuringLeave = leavePeriods.some(
                (period) =>
                  !day.isBefore(period.start, "day") &&
                  !day.isAfter(period.end, "day")
              );
              return !isDuringLeave;
            }

            return true;
          }).length;

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
  }, [username, month, daysInMonth, holidays, refreshKey, token]);

  return {
    employeeFullName,
    attendanceData,
    summary,
    loading,
    month,
    setMonth,
    daysInMonth,
    holidays,
    joinDate,
  };
};
