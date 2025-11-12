import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../api";
import { addToCart, removeFromCart, isInCart } from "../utils/cart";
import { CartContext } from "../components/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({}); // { productId: quantity }
  const [errors, setErrors] = useState({}); // { productId: error message }
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        // Initialize quantities to 1 for all products
        const initialQuantities = {};
        data.forEach((p) => (initialQuantities[p.id] = 1));
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const increaseQuantity = (productId, stock) => {
    setErrors((prev) => ({ ...prev, [productId]: "" }));
    setQuantities((prev) => {
      if (prev[productId] < stock)
        return { ...prev, [productId]: prev[productId] + 1 };

      // show error if exceeds stock
      setErrors((prev) => ({
        ...prev,
        [productId]: `Only ${stock} in stock`,
      }));
      return prev;
    });
  };

  const decreaseQuantity = (productId) => {
    setErrors((prev) => ({ ...prev, [productId]: "" }));
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(prev[productId] - 1, 1),
    }));
  };

  const toggleCart = (product) => {
    const quantity = quantities[product.id] || 1;

    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, quantity }); // pass user-selected quantity
    }

    refreshCart();
  };

  if (loading) return <p className="text-center mt-5">Loading products...</p>;
  if (products.length === 0)
    return <p className="text-center mt-5">No products available.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Products</h2>

      {/* Product list  */}
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm p-3">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text">
                {p.description || "No description available."}
              </p>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="fw-bold">₹{p.price}</span>

                {/* Quantity controls */}
                {p.stock > 0 && (
                  <div className="d-flex flex-column align-items-center me-2">
                    <div className="d-flex align-items-center mb-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(p.id)}
                      >
                        -
                      </button>
                      <span className="mx-2">{quantities[p.id] || 1}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => increaseQuantity(p.id, p.stock)}
                        disabled={quantities[p.id] >= p.stock}
                      >
                        +
                      </button>
                    </div>
                    {errors[p.id] && (
                      <small className="text-danger">{errors[p.id]}</small>
                    )}
                  </div>
                )}

                {/* Add / Remove Cart button */}
                <button
                  className={`btn btn-sm ${
                    p.stock === 0
                      ? "btn-secondary"
                      : isInCart(p.id)
                      ? "btn-danger"
                      : "btn-primary"
                  }`}
                  onClick={() => toggleCart(p)}
                  disabled={p.stock === 0}
                >
                  {isInCart(p.id)
                    ? "Remove from Cart"
                    : p.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
