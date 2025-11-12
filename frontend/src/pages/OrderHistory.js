import React, { useState, useEffect } from "react";
import { getUserOrdeHistory } from "../api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserOrdeHistory()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (orders.length === 0) return <p>You have no past orders.</p>;

  return (
    <div className="container mt-5">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3">
          <div className="card-header">
            <strong>Order #{order.id}</strong> — ₹{order.total}
            <span className="float-end">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>
          <div className="card-body">
            <table className="table table-bordered mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name || item.product}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
