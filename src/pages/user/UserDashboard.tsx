import React from "react";

const UserDashboard: React.FC = () => {
    return (
      <div className="bg-light p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold">Welcome User 🎉</h2>
        <p className="text-gray-600 mt-2">
          Your account is active. Explore available features.
        </p>
      </div>
    );
  };
  
  export default UserDashboard;
  