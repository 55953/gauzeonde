import React from "react";
import AuthComponent from "../components/Auth";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <AuthComponent />
    </div>
  );
}