import React, { useState, useEffect } from "react";
import ProductsTable from "../components/admin/ProductsTable";
import OrdersTable from "../components/admin/OrdersTable";
import UsersTable from "../components/admin/UsersTable";
import { getAdminDashboardStats } from "../api";

import "../css/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      {/* DASHBOARD STATS */}
      {loading ? (
        <p className="text-center">Loading dashboard...</p>
      ) : (
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3 text-center">
              <h5>Total Users</h5>
              <h3>{stats.total_users}</h3>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3 text-center">
              <h5>Total Products</h5>
              <h3>{stats.total_products}</h3>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3 text-center">
              <h5>Total Orders</h5>
              <h3>{stats.total_orders}</h3>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm p-3 text-center">
              <h5>Total Revenue</h5>
              <h3>₹{stats.total_revenue}</h3>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <ul className="nav nav-tabs mb-4 flex-wrap">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
      </ul>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "products" && (
          <div className="table-responsive">
            <ProductsTable />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="table-responsive">
            <OrdersTable />
          </div>
        )}

        {activeTab === "users" && (
          <div className="table-responsive">
            <UsersTable />
          </div>
        )}
      </div>
    </div>
  );
}
