import React, { useContext, useState } from "react";
import { useUserProfile } from "./UserProfile.hooks";
import { AuthContext } from "../context/AuthContext";
import {  UserCircle } from "lucide-react";
import MiniWindow from "../components/MiniWindow";
import EditUser from "./admin/EditUser";
import Button from "../components/Button";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import Loader from "../components/Loader";


const UserProfile = () => {
  const { token, username } = useContext(AuthContext);
  const { profile, loading, refetch: fetchProfile,setOpenForgotPassword, openForgotPassword } = useUserProfile(username, token);

  // For Edit User
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserData, setEditUserData] = useState<any>(null);

  if (loading) return <Loader fullScreen />;
  if (!profile) return <div className="text-center py-10">No user found</div>;

  return (
    <div className="max-w-sm mx-auto backdrop-blur-sm bg-white/65 text-dark border-white border-1 rounded-lg shadow-lg p-6 text-center mt-2">

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-from to-gradient-to flex items-center justify-center text-primary">
          <span><UserCircle className="size-20" /></span>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-dark">{profile.name}</h3>

      {/* Roles */}

      <div className="flex flex-wrap justify-center gap-2 m-3">

        <span
          key={profile.roles}
          className="px-2 py-1 bg-light text-primary text-xs rounded-full border border-primary"
        >
          {profile.roles}
        </span>

      </div>


      {/* Profile details */}
      <div className="text-left space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-secondary">Username</span>
          <span>{profile.username}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-secondary">Full Name</span>
          <span>{profile.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-secondary">Email</span>
          <span>{profile.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-secondary">Phone</span>
          <span>{profile.phoneNumber}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between space-x-4">
      {/* Edit Button */}
      <Button
        variant="primary"
        title="Edit"
        onClick={() => {
          setEditUserData(profile)
          setOpenEdit(true);
        }}
      >
        Edit Profile
      </Button>

      <Button
        variant="secondary"
        title="Change Password"
        onClick={() => setOpenForgotPassword(true)}
      >
        Change Password
      </Button>

      </div>

      <MiniWindow isOpen={openEdit} onClose={() => {setOpenEdit(false); fetchProfile();}} size="small">
        {editUserData && (
          <EditUser userData={editUserData} onClose={() => setOpenEdit(false)} />
        )}
      </MiniWindow>

      <MiniWindow isOpen={openForgotPassword} onClose={() => setOpenForgotPassword(false)} size="small">
          <ForgotPassword title="Change Password"/>
      </MiniWindow>
    </div>
  );
};

export default UserProfile;
