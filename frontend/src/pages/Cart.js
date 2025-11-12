import React, { useState, useEffect, useContext } from "react";
import { createOrder } from "../api";
import { getToken } from "../auth";
import { CartContext } from "../components/CartContext";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(savedCart);
  }, []);

  const updateQuantity = (productId, newQty, stock) => {
    let updatedItems;

    if (newQty < 1) {
      // Remove the item from the cart
      updatedItems = items.filter((item) => item.id !== productId);
    } else {
      // Update the quantity normally
      updatedItems = items.map((item) => {
        if (item.id === productId) {
          const qty = Math.min(newQty, stock);
          return { ...item, quantity: qty };
        }
        return item;
      });
    }

    setItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    refreshCart();
  };
  // calculating the total cost of all products in the cart
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const body = {
        items: items.map((i) => ({ product: i.id, quantity: i.quantity })),
      };
      const res = await createOrder(body, getToken());
      setMessage(`Order placed successfully! Total: ₹${res.total}`);
      setItems([]);
      localStorage.removeItem("cart");
      refreshCart();
    } catch (err) {
      setMessage("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1, item.stock)
                        }
                        disabled={false}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1, item.stock)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    {item.quantity >= item.stock && (
                      <small className="text-danger">
                        Only {item.stock} in stock
                      </small>
                    )}
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="fw-bold">Total: ₹{total}</p>

          <button
            className="btn btn-success"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
