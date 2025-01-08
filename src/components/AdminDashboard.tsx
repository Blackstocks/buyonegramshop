import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardOverview from "./DashboardOverview";
import ProductsManagement from "./ProductsManagement";
import UsersManagement from "./UsersManagement";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full px-4 py-3 text-left text-sm font-medium ${
              activeTab === "dashboard"
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full px-4 py-3 text-left text-sm font-medium ${
              activeTab === "products"
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full px-4 py-3 text-left text-sm font-medium ${
              activeTab === "users"
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Users
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "products" && <ProductsManagement />}
        {activeTab === "users" && <UsersManagement />}
      </div>
    </div>
  );
}
