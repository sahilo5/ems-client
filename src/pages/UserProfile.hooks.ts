import { useContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import { useToast } from "../components/ToastProvider";
import { AuthContext } from "../context/AuthContext";
import { useEditUser } from "./admin/EditUser.hooks";

interface UserProfileData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: string| null; 
}

export const useUserProfile = (username: string | null, token: string | null) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const { role } = useContext(AuthContext);
  const { showToast } = useToast();
  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api(`/user/getUserByUsername/${username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        const user = response.data;
        setProfile({
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          roles: role // assuming roles is an array of objects
        });
      } else {
        showToast(response.message, "error");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  const handleEdit = () => {
    // You can route to an edit page or open a modal
    console.log("Edit Profile clicked");
  };

  return { profile, loading, handleEdit, refetch: fetchProfile,setOpenForgotPassword,openForgotPassword };
};
