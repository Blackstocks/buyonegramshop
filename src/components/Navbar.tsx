import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ShoppingBag, LogOut, Users, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoginRegisterModal from "./LoginRegisterModal";

export default function Navbar() {
  const { user, signOut, profile } = useAuth();
  const { cart } = useCart();

  const [showModal, setShowModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Brand */}
          <Link to="/" className="flex items-center space-x-1">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">GroceryStore</span>
          </Link>

          {/* Middle Section: Search Bar (Hidden in Mobile View) */}
          <div className="flex-1 hidden mx-4 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
              <svg
                className="absolute left-3 top-2.5 text-gray-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-green-600">
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-600 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Link (Visible on Larger Screens) */}
            {profile?.is_admin && (
              <Link
                to="/admin"
                className="items-center hidden space-x-1 text-gray-700 md:flex hover:text-green-600"
              >
                <Users className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Login/Register or Sign Out */}
            {!user ? (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full hover:bg-green-600 md:w-auto md:px-4 md:py-2 md:rounded-md"
              >
                <User className="w-5 h-5 md:hidden" />
                <span className="hidden md:block">Login / Register</span>
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center w-8 h-8 text-gray-700 rounded-full hover:text-green-600 md:w-auto md:px-4 md:py-2 md:rounded-md"
              >
                <LogOut className="w-5 h-5 md:hidden" />
                <span className="hidden md:block">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login/Register Modal */}
      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}

