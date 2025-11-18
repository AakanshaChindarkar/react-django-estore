export async function apiFetch(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("access"); // JWT access token

  const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // <-- Authorization header
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  // Handle empty response (like DELETE returning 204 No Content)
  if (res.status === 204) return null;
  return res.json();
}

// Products APIs
export const getProducts = () => apiFetch("products/");
export const getProductById = (id) => apiFetch(`products/${id}/`);

// Users APIs (example)
export const getUserOrdeHistory = () => apiFetch("my-orders/");

// Registering user
export const registerUser = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  return apiFetch("register/", "POST", {
    username,
    email,
    password,
    password2: confirmPassword,
  });
};

// User login – get JWT token
export const loginUser = ({ username, password }) => {
  return apiFetch("admin/api/token/", "POST", { username, password });
};

// Create a new order
export const createOrder = (orderData, token) => {
  return apiFetch("orders/", "POST", orderData, token);
};

export const getOrders = (token) => {
  return apiFetch("orders/", "GET", null, token);
};

// Admin APIS

// Get all products (admin view)
export const getAdminProducts = () => apiFetch("admin/products/", "GET");

// creating productapi
export const createProduct = (data) =>
  apiFetch("admin/products/", "POST", data);

// updating productapi
export const updateProduct = (id, data) =>
  apiFetch(`admin/products/${id}/`, "PUT", data);

// get user
export const adminGetUsers = () => apiFetch("admin/users/", "GET");

// creating user
export const adminCreateUser = (data) => apiFetch("admin/users/", "POST", data);

// update user
export const adminUpdateUser = (id, data) =>
  apiFetch(`admin/users/${id}/`, "PUT", data);

// delete user
export const adminDeleteUser = (id) => apiFetch(`admin/users/${id}/`, "DELETE");

// Admin orders
export const adminGetOrders = () => apiFetch("admin/orders/", "GET");

//Delete Product
export const adminDeleteProduct = (id) =>
  apiFetch(`admin/products/${id}/`, "DELETE");
