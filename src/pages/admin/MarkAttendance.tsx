import React, { useState } from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import { useMarkAttendance } from "./MarkAttendance.hooks";
import AttendanceCalendar from "./AttendanceSummary";
import TimeInput from "../../components/TimeInput";

const MarkAttendance = () => {
  const {
    username,
    setUsername,
    employees,
    date,
    setDate,
    mode,
    setMode,
    actionType,
    setActionType,
    checkin,
    setCheckin,
    checkout,
    setCheckout,
    onSubmitAttendance,
    errors,
    loading,
  } = useMarkAttendance();

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmitAttendance();
    if (success) {
      setRefreshKey((prev) => prev + 1); 
    }
  };

  return (
    <div className="w-full backdrop-blur-sm bg-white/40 text-dark shadow-inner shadow-white/50 border-white p-4 rounded-lg border mx-auto">
      {/* Mode Toggle */}
      <div className="flex gap-1 backdrop-blur-lg bg-white/40 border-1 border-white rounded-full p-0.5 w-fit mb-3">
        <button
          onClick={() => setMode("mark")}
          className={`px-2 py-1 rounded-full ${mode === "mark"
              ? "backdrop-blur-sm bg-accent/50 text-dark border-accent border-1 shadow-inner shadow-accent/20"
              : "text-gray-700 hover:bg-accent/30"
            }`}
        >
          Mark Attendance
        </button>

        <button
          onClick={() => setMode("update")}
          className={`px-2 py-1 rounded-full ${mode === "update"
              ? "backdrop-blur-sm bg-accent/50 text-dark border-accent border-1 shadow-inner shadow-accent/20"
              : "text-gray-700 hover:bg-accent/30"
            }`}
        >
          Update Attendance
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-end"
      >
        {/* Employee Dropdown */}
        <div className="w-full md:w-1/4">
          <Dropdown
            label="Employee"
            options={employees}
            value={username}
            onChange={setUsername}
          />
          {errors.usernameError && (
            <div className="text-sm text-red-500">{errors.usernameError}</div>
          )}
        </div>

        {mode === "mark" ? (<>
          {/* Date */}
          <div className="w-full md:w-1/4">
            <Form
              fields={[
                {
                  type: "date",
                  disabled: true,
                  name: "date",
                  label: "Date",
                  value: date,
                  onChange: setDate,
                  error: errors.dateError,
                },
              ]}
            />
          </div>
          <div className="w-full md:w-1/4">
            <Dropdown
              label="Action"
              options={[
                { label: "Check In", value: "checkin" },
                { label: "Check Out", value: "checkout" },
              ]}
              value={actionType}
              onChange={setActionType}
            />
          </div>
        </>
        ) : (
          // Checkin & Checkout inputs for Update
          <>

            {/* Date */}
            <div className="w-full md:w-1/4">
              <Form
                fields={[
                  {
                    type: "date",
                    name: "date",
                    label: "Date",
                    value: date,
                    onChange: setDate,
                    error: errors.dateError,
                  },
                ]}
              />
            </div>
            <div className="w-full md:w-1/4">
              <TimeInput
                label="Check-In"
                value={checkin}
                onChange={setCheckin}
                error={errors.timeError}
              />
            </div>

            <div className="w-full md:w-1/4">
              <TimeInput
                label="Check-Out"
                value={checkout}
                onChange={setCheckout}
                error={errors.timeError}
              />
            </div>

          </>
        )}

        {/* Submit Button */}
        <div className="w-full md:w-1/4">
          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? mode === "mark"
                ? "Marking..."
                : "Updating..."
              : mode === "mark"
                ? "Mark Attendance"
                : "Update Attendance"}
          </Button>
        </div>
      </form>
      {username &&
        <AttendanceCalendar username={username} refreshKey={refreshKey} />}
    </div>
  );
};

export default MarkAttendance;
