import React, { useState } from "react";
import { updateProduct, createProduct } from "../../api";

export default function AddEditProductModal({ product, onClose, reload }) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || 0);
  const [stock, setStock] = useState(product.stock || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (product.id) {
        await updateProduct(product.id, { name, description, price, stock });
      } else {
        await createProduct({ name, description, price, stock });
      }
      reload();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop-wrapper">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {product.id ? "Edit Product" : "Add Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-2">
                  <label htmlFor="productName" className="form-label">
                    Name
                  </label>
                  <input
                    id="productName"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="productDescription" className="form-label">
                    Description
                  </label>
                  <input
                    id="productDescription"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="productPrice" className="form-label">
                    Price (₹)
                  </label>
                  <input
                    id="productPrice"
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="productStock" className="form-label">
                    Stock
                  </label>
                  <input
                    id="productStock"
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  {product.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
