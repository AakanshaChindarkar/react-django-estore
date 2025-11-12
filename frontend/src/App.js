import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import { CartProvider } from "./components/CartContext";
import OrderHistory from "./pages/OrderHistory";
import GlobalMouseCircle from "./components/GlobalMouseCircle";

// Lazy load pages
const Products = React.lazy(() => import("./pages/Products"));
const Register = React.lazy(() => import("./pages/Register"));
const Cart = React.lazy(() => import("./pages/Cart"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

const Loader = () => <div className="text-center mt-10">Loading...</div>;

function App() {
  return (
    <Router>
      {/* Global mouse-follow circle */}
      <GlobalMouseCircle />
      <CartProvider>
        <AppNavbar />
        <div className="container mt-4">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
