import React from "react";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import MiniWindow from "../../components/MiniWindow";
import Browse from "../../components/Browse";
import Form from "../../components/Form";
import { useSystemSettings } from "./SystemSettings.hooks";
import TimeInput from "../../components/TimeInput";
import { Delete, Edit, FileX, Plus } from "lucide-react";

const SystemSettings = () => {
  const {
    settings,
    loading,
    updateLocalSetting,
    isOpenHolidays,
    setIsOpenHolidays,
    saveAll,
    dirty,
    handleDeleteHoliday,
    handleUpdateHoliday,
    handleAddHoliday,
    isHolidayFormOpen, setIsHolidayFormOpen,
    editingHoliday, setEditingHoliday,
    deleteConfirmOpen, setDeleteConfirmOpen,
    selectedToDelete, setSelectedToDelete,
    holidayDate, setHolidayDate,
    holidayName, setHolidayName,
    errors, setErrors
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
    const isDisabled = s.category === "sms" || s.category === "security";

    if (s.dataType === "TIME") {
      return (
        <TimeInput
          value={s.data.value}
          onChange={(val) => updateLocalSetting(s.id, val)}
          disabled={isDisabled}
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
              disabled: isDisabled,
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
              disabled: isDisabled,
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
            disabled: isDisabled,
          },
        ]}
      />
    );
  };


  const holidayData =
    groupByCategory("attendance").find(
      (s) => s.key === "calendar_holidays_2025"
    )?.data.list || [];


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
          data={holidayData}
          columns={HolidayColumns}
          selectable={true}
          headerActions={(selectedRows) => (
            <div className="space-x-2 flex">
              {/* Add */}
              <Button
                variant="tertiary"
                title="Add Holiday"
                onClick={() => {
                  setEditingHoliday(null); // add mode
                  setIsHolidayFormOpen(true);
                }}
              >
                <Plus />
              </Button>

              {/* Edit */}
              <Button
                variant="tertiary"
                title="Edit Holiday"
                disabled={selectedRows.length !== 1}
                onClick={() => {
                  const idx = holidayData.findIndex(
                    (h) => h.date === selectedRows[0].date && h.name === selectedRows[0].name
                  );
                  if (idx !== -1) {
                    setEditingHoliday({ index: idx, ...holidayData[idx] });
                    setIsHolidayFormOpen(true);
                  }
                }}
              >
                <Edit />
              </Button>

              {/* Delete */}
              <Button
                variant="tertiary"
                title="Delete Holiday"
                disabled={selectedRows.length === 0}
                onClick={() => {
                  setSelectedToDelete(selectedRows);
                  setDeleteConfirmOpen(true);
                }}
              >
                <FileX />
              </Button>
            </div>
          )}
        />
      </MiniWindow>


      <MiniWindow
        isOpen={isHolidayFormOpen}
        onClose={() => setIsHolidayFormOpen(false)}
        size="small"
      >
        <div className="space-y-4">
          <Form
            className="mt-4"
            fields={[
              {
                type: "date",
                name: "date",
                label: "Date",
                value: holidayDate,
                onChange: setHolidayDate,
                error: errors.date,
              },
              {
                type: "text",
                name: "name",
                label: "Holiday Name",
                value: holidayName,
                onChange: setHolidayName,
                placeholder: "Enter holiday name",
                error: errors.name,
              },
            ]}
            submitLabel="Save"
            onSubmit={() => {
              const newErrors: typeof errors = {};
              if (!holidayDate) newErrors.date = "Date is required";
              if (!holidayName.trim()) newErrors.name = "Holiday name is required";

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
              }

              if (editingHoliday) {
                handleUpdateHoliday(editingHoliday.index, {
                  date: holidayDate,
                  name: holidayName,
                });
              } else {
                handleAddHoliday({ date: holidayDate, name: holidayName });
              }

              setIsHolidayFormOpen(false);
            }}
          />
        </div>
      </MiniWindow>


      {/* Delete Confirmation */}
      <MiniWindow
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        size="small"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Confirm Delete</h2>
          <p>Are you sure you want to delete {selectedToDelete.length} holiday(s)?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                selectedToDelete.forEach((row) => {
                  const idx = holidayData.findIndex((h) => h.date === row.date && h.name === row.name);
                  if (idx !== -1) handleDeleteHoliday(idx);
                });
                setDeleteConfirmOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </MiniWindow>

    </div>
  );
};

export default SystemSettings;
