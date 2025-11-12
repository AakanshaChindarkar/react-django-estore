import React, { useEffect, useState } from "react";
import { adminGetUsers, adminDeleteUser } from "../../api";
import AddEditUserModal from "./AddEditUserModal";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminGetUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      await adminDeleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => setModalUser(u)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-success" onClick={() => setModalUser({})}>
          +Add New User
        </button>
      </div>
      {modalUser && (
        <AddEditUserModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          reload={loadUsers}
        />
      )}
    </div>
  );
}
