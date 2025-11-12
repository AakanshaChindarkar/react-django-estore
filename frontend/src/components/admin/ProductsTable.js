import React, { useEffect, useState } from "react";
import { getAdminProducts, adminDeleteProduct } from "../../api";
import AddEditProductModal from "./AddEditProductModal";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // GET products with token
      const data = await getAdminProducts();
      // console.log(data);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;

    try {
      await adminDeleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Sr no</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description || "-"}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setModalProduct(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-success" onClick={() => setModalProduct({})}>
          + Add New Product
        </button>
      </div>

      {/* Add/Edit Modal */}
      {modalProduct && (
        <AddEditProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          reload={loadProducts}
        />
      )}
    </div>
  );
}
