import React, { useState } from "react";
import { adminCreateUser, adminUpdateUser } from "../../api";

export default function AddEditUserModal({ user, onClose, reload }) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [isAdmin, setIsAdmin] = useState(user.role === "admin" || false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      if (user.id) {
        await adminUpdateUser(user.id, {
          username,
          email,
          is_staff: isAdmin,
          role: isAdmin ? "admin" : "customer",
        });
      } else {
        await adminCreateUser({
          username,
          email,
          password,
          is_staff: isAdmin,
          role: isAdmin ? "admin" : "customer",
        });
      }

      reload();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  return (
    <div className="modal-backdrop-wrapper">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {user.id ? "Edit User" : "Add User"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!user.id && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                )}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    id="isAdminCheck"
                  />
                  <label className="form-check-label" htmlFor="isAdminCheck">
                    Admin
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {user.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
