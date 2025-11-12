import React, { useEffect, useState } from "react";
import { adminGetOrders } from "../../api";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders();

      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-3">Loading orders...</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Sr no</th>
            <th>Username</th>
            <th>Item(s) Ordered</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user.username}</td>
              <td>
                {" "}
                {o.items
                  .map((item) => `${item.product_name} x ${item.quantity}`)
                  .join(", ")}
              </td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
