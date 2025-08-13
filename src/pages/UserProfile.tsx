import React, { useContext, useState } from "react";
import { useUserProfile } from "./UserProfile.hooks";
import { AuthContext } from "../context/AuthContext";
import { ProportionsIcon, UserCircle, UserCircle2 } from "lucide-react";
import MiniWindow from "../components/MiniWindow";
import EditUser from "./admin/EditUser";
import Button from "../components/Button";


const UserProfile = () => {
  const { token, username } = useContext(AuthContext);
  const { profile, loading, refetch: fetchProfile  } = useUserProfile(username, token);

  // For Edit User
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserData, setEditUserData] = useState<any>(null);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profile) return <div className="text-center py-10">No user found</div>;

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 text-center">

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-from to-gradient-to flex items-center justify-center text-primary">
          <span><UserCircle className="size-20" /></span>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-dark">{profile.name}</h3>

      {/* Roles */}

      <div className="flex flex-wrap justify-center gap-2 mb-6">

        <span
          key={profile.roles}
          className="px-2 py-1 bg-light text-primary text-xs rounded-full border border-primary"
        >
          {profile.roles}
        </span>

      </div>


      {/* Profile details */}
      <div className="text-left space-y-2 border-t pt-4">
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

      <MiniWindow isOpen={openEdit} onClose={() => {setOpenEdit(false); fetchProfile();}} size="small">
        {editUserData && (
          <EditUser userData={editUserData} onClose={() => setOpenEdit(false)} />
        )}
      </MiniWindow>
    </div>
  );
};

export default UserProfile;
