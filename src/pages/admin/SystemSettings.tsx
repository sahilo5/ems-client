import React from "react";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import Browse from "../../components/Browse";
import Form from "../../components/Form";
import { useSystemSettings } from "./SystemSettings.hooks";
import TimeInput from "../../components/TimeInput";

const SystemSettings = () => {
  const {
    settings,
    loading,
    updateLocalSetting,
    isOpenHolidays,
    setIsOpenHolidays,
    saveAll,
    dirty,
  } = useSystemSettings();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader size={48} color="text-primary" />
      </div>
    );
  }

  const groupByCategory = (cat: string) =>
    settings.filter((s) => s.category === cat);

  const HolidayColumns = [
    { header: "Date", accessor: "date" },
    { header: "Name", accessor: "name" },
  ];

  const renderField = (s: any) => {
    if (s.dataType === "TIME") {
      return (
        <TimeInput
          value={s.data.value}
          onChange={(val) => updateLocalSetting(s.id, val)}
        />
      );
    }
    if (s.dataType === "INT") {
      return (
        <Form
          fields={[
            {
              type: "number",
              name: s.key,
              value: s.data.value,
              onChange: (val) => updateLocalSetting(s.id, val),
            },
          ]}
        />
      );
    }
    if (s.key.includes("email")) {
      return (
        <Form
          fields={[
            {
              type: "email",
              name: s.key,
              value: s.data.value,
              onChange: (val) => updateLocalSetting(s.id, val),
            },
          ]}
        />
      );
    }
    return (
      <Form
        fields={[
          {
            type: "text",
            name: s.key,
            value: s.data.value,
            onChange: (val) => updateLocalSetting(s.id, val),
          },
        ]}
      />
    );
  };

  return (
    <div className="relative p-6 rounded-2xl shadow-lg bg-gray-200 space-y-8">
      {["general", "attendance", "email", "sms", "security"].map((cat) => (
        <section key={cat}>
          <h2 className="text-xl font-bold mb-4 text-primary capitalize">
            {cat} Settings
          </h2>
          <div className="space-y-4">
            {groupByCategory(cat)
              .filter((s) =>
                cat === "attendance" ? s.key !== "calendar_holidays_2025" : true
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-gray-300 pb-2"
                >
                  <label className="font-medium text-secondary">{s.title}</label>
                  {renderField(s)}
                </div>
              ))}

            {cat === "attendance" && (
              <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                <label className="font-medium text-secondary">
                  Calendar Holidays
                </label>
                <Button variant="secondary" onClick={() => setIsOpenHolidays(true)}>
                  Manage Holidays
                </Button>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Floating Save Button */}
      {dirty && (
        <div className="fixed bottom-6 right-6">
          <Button variant="primary" onClick={saveAll}>
            Save Changes
          </Button>
        </div>
      )}

      {/* Holidays Modal */}
      <MiniWindow
        isOpen={isOpenHolidays}
        onClose={() => setIsOpenHolidays(false)}
      >
        <Browse
          title="Holiday List"
          data={
            groupByCategory("attendance").find(
              (s) => s.key === "calendar_holidays_2025"
            )?.data.list || []
          }
          columns={HolidayColumns}
        />
      </MiniWindow>
    </div>
  );
};

export default SystemSettings;
