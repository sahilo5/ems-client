import { useState, useContext, useEffect } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { AuthContext } from "../../context/AuthContext";

export type Setting = {
  id: number;
  category: string;
  key: string;
  title: string;
  description: string;
  dataType: "STRING" | "INT" | "TIME" | "LIST";
  data: { value?: any; list?: any[] }; // normalized
};

type PendingChange = {
  id: number;
  payload: any;
  title: string;
};

export const useSystemSettings = () => {
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();

  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenHolidays, setIsOpenHolidays] = useState(false);
  const [dirty, setDirty] = useState(false); // track unsaved changes
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  // --- Normalize backend response ---
  const normalize = (s: any): Setting => {
    let parsed: any;
    try {
      parsed = JSON.parse(s.data);
    } catch {
      parsed = {};
    }

    if (s.dataType === "LIST") {
      return { ...s, data: { list: Array.isArray(parsed) ? parsed : [] } };
    } else {
      return { ...s, data: { value: parsed.value ?? "" } };
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api(`/admin/settings/getAllSettings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.success) {
        setSettings(response.data.map((s: any) => normalize(s)));
      } else {
        showToast(response.message, "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validation per type
  const validateValue = (s: Setting, value: any): string | null => {
    if (s.dataType === "INT" && isNaN(Number(value))) {
      return `${s.title} must be a number`;
    }
    if (s.dataType === "TIME" && !/^\d{2}:\d{2}$/.test(value)) {
      return `${s.title} must be in HH:mm format`;
    }
    if (s.key.toLowerCase().includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${s.title} must be a valid email`;
      }
    }
    return null;
  };

  const updateLocalSetting = (id: number, value: any) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, data: { ...s.data, value } } : s
      )
    );

    const s = settings.find((item) => item.id === id);
    if (!s) return;

    // Run validation
    const error = validateValue(s, value);
    if (error) {
      showToast(error, "error");
      return;
    }

    // Build payload
    let payload: any;
    if (s.dataType === "LIST") {
      payload = value; // holiday list etc.
    } else {
      payload = { value };
    }

    // Update or add to pendingChanges
    setPendingChanges((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (exists) {
        return prev.map((p) => (p.id === id ? { ...p, payload } : p));
      }
      return [...prev, { id, payload, title: s.title }];
    });

    setDirty(true);
  };

  const saveAll = async () => {
    if (pendingChanges.length === 0) {
      showToast("No changes to save", "info");
      return;
    }

    try {
      for (const change of pendingChanges) {
        const response = await api(`/admin/settings/update/${change.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: JSON.stringify(change.payload)
          }),
          
        });

        if (!response.success) {
          showToast(`Failed to update ${change.title}: ${response.message}`, "error");
        }
      }
      showToast("Settings saved successfully!", "success");
      setDirty(false);
      setPendingChanges([]);
      fetchSettings();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    isOpenHolidays,
    setIsOpenHolidays,
    updateLocalSetting,
    saveAll,
    dirty,
    pendingChanges,
  };
};
