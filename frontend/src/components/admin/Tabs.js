import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <ul className="nav nav-tabs">
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
  );
}
