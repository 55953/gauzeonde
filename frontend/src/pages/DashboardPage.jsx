import React from "react";
import { getUser, logout } from "../auth";
import DriverDashboard from "./Dashboards/DriverDashboard";
import SenderDashboard from "./Dashboards/SenderDashboard";
import AdminDashboard from "./Dashboards/AdminDashboard";

export default function DashboardPage() {
  // Get user data from auth
  const user = getUser();

  if (!user) return <div>No user data.</div>;

  let DashboardView;
  switch (user.role) {
    case "driver":
      DashboardView = <DriverDashboard user={user} />;
      break;
    case "sender":
      DashboardView = <SenderDashboard user={user} />;
      break;
    case "admin":
      DashboardView = <AdminDashboard user={user} />;
      break;
    default:
      DashboardView = <div>Unknown role: {user.role}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50">
      <div className="bg-white shadow p-8 rounded-lg w-full max-w-2xl mt-12">
        {DashboardView}
        <div className="mt-6">
          <a href="/profile" className="text-blue-700 underline mr-4">Edit Profile</a>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
