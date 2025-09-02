import React from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import { useMarkAttendance } from "./MarkAttendance.hooks";
import AttendanceCalendar from "./AttendanceSummary";

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

  return (
    <div className="w-full bg-gray-200 shadow-lg p-4 rounded-2xl border border-gray-200 mx-auto">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 border-2 rounded-lg border-accent p-2 w-full sm:w-90">        <label className="flex items-center gap-2">
        <input
          type="radio"
          name="mode"
          value="mark"
          checked={mode === "mark"}
          onChange={() => setMode("mark")}
        />
        Mark Attendance
      </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            value="update"
            checked={mode === "update"}
            onChange={() => setMode("update")}
          />
          Update Attendance
        </label>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitAttendance();
        }}
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

        {mode === "mark" ? (
          // Action dropdown only for Mark
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
        ) : (
          // Checkin & Checkout inputs for Update
          <>
            <div className="w-full md:w-1/4">
              <Form
                fields={[
                  {
                    type: "text",
                    name: "checkin",
                    label: "Check-In (HH:mm)",
                    value: checkin,
                    onChange: setCheckin,
                    error: errors.timeError,
                    placeholder: "09:30",
                  },
                ]}
              />
            </div>
            <div className="w-full md:w-1/4">
              <Form
                fields={[
                  {
                    type: "text",
                    name: "checkout",
                    label: "Check-Out (HH:mm)",
                    value: checkout,
                    onChange: setCheckout,
                    placeholder: "18:00",
                  },
                ]}
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
      {username && <AttendanceCalendar username={username} />}
    </div>
  );
};

export default MarkAttendance;
