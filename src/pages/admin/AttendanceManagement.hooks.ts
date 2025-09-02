import { useState, useContext } from "react";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export const useAttendanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const { showToast } = useToast();



  return {
    loading,
  };
};
