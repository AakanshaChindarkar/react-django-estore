import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { isLoggedIn, logout, getUserRole } from "../auth";
import { CartContext } from "../components/CartContext";

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const role = getUserRole();
  const [isOpen, setIsOpen] = useState(false); // mobile menu state

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Electronics EStore
        </NavLink>

        {/* Cart icon on mobile only (beside hamburger) */}
        {role !== "admin" && (
          <NavLink
            to="/cart"
            className="d-lg-none nav-link position-relative me-2"
          >
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            )}
          </NavLink>
        )}
        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            {/* Giving condition to display products page to customers only, is visible when user is not logged in too*/}
            {role !== "admin" && (
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " bg-dark text-white fw-bold" : "")
                  }
                  onClick={() => setIsOpen(false)} // close menu on click
                >
                  Products
                </NavLink>
              </li>
            )}

            {/* Giving condition to display admin dashboard to admin only when loggedin*/}
            {isLoggedIn() && role === "admin" && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " bg-dark text-white fw-bold" : "")
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {/* Giving condition to display view order history to cutomers only when loggedin*/}
            {isLoggedIn() && role === "customer" && (
              <li className="nav-item">
                <NavLink
                  to="/orderhistory"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " bg-dark text-white fw-bold" : "")
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Order History
                </NavLink>
              </li>
            )}
            {/* Giving condition for Logout, Login , register buttons */}
            {isLoggedIn() ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      "nav-link" +
                      (isActive ? " bg-dark text-white fw-bold" : "")
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      "nav-link" +
                      (isActive ? " bg-dark text-white fw-bold" : "")
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Giving condition to display cart icon to customers only, is visible when user is not logged in too*/}
            {role !== "admin" && (
              <li className="nav-item d-none d-lg-block">
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    "nav-link position-relative" +
                    (isActive ? " bg-dark text-white fw-bold" : "")
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="badge bg-danger ms-1">{cartCount}</span>
                  )}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
