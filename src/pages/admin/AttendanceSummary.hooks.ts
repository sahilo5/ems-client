import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export type AttendanceDay = {
  date: string; // "YYYY-MM-DD"
  checkIn?: string;
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

  /** fetch holidays from settings */
  const fetchHolidays = async () => {
    try {
      const res = await api("/admin/settings/1", {
        method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });
      if (res?.success && res.data?.data) {
        const parsed: Holiday[] = JSON.parse(res.data.data);
        setHolidays(parsed);
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to fetch holidays", "error");
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
        return;
      }

      setLoading(true);

      // Fetch full name
      const fullNameRespone = await api(`/user/fullName/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setEmployeeFullName(`${fullNameRespone.firstName} ${fullNameRespone.lastName}`);
  
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
          const data: AttendanceDay[] = response.data || [];
          const normalized = data.map((d: any) => ({
            date: d.date,
            checkIn: d.checkIn ?? d.checkInTime ?? null,
            checkOut: d.checkOut ?? d.checkOutTime ?? null,
            totalHours: d.totalHours ?? 0,
            status: d.status ?? "PRESENT",
          }));
          setAttendanceData(normalized);

          // compute stats
          const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
            dayjs(month).date(i + 1).format("YYYY-MM-DD")
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

          const workingDays = daysArray.filter((d) => {
            const isSunday = dayjs(d).day() === 0;
            const isHoliday = holidays.some((h) => h.date === d);
            return !isSunday && !isHoliday;
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
  }, [username, month, daysInMonth, holidays, refreshKey]);

  return { employeeFullName,attendanceData, summary, loading, month, setMonth, daysInMonth, holidays };
};
