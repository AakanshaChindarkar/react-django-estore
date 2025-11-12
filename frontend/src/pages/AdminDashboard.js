import React, { useState } from "react";
import ProductsTable from "../components/admin/ProductsTable";
import OrdersTable from "../components/admin/OrdersTable";
import UsersTable from "../components/admin/UsersTable";

import "../css/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div>
        {/* Wrap tables in a responsive container */}
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
