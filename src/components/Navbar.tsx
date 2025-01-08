import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, ChevronDown, LogOut, Search, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProductFilter } from '../context/ProductFilterContext';
import LoginRegisterModal from './LoginRegisterModal';

export default function Navbar() {
  const { user, signOut, profile } = useAuth();
  const { cart } = useCart();
  const { setSearchQuery, setCategory } = useProductFilter();

  const [showModal, setShowModal] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const categories = ['All Products', 'Pulses', 'Rice', 'Dals'];

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

          {/* Middle Section: Search Box */}
          <div className="relative flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
            </div>
          </div>

          {/* Right Section: Cart, Category, Auth, and Admin */}
          <div className="flex items-center space-x-4">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdown(!categoryDropdown)}
                className="flex items-center px-3 py-2 space-x-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <span>Category</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {categoryDropdown && (
                <div className="absolute left-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCategory(category);
                        setCategoryDropdown(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-green-600">
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-600 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Link (Visible Only to Admins) */}
            {profile?.is_admin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
              >
                <Users className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {!user ? (
              <>
                {/* Login/Register Modal */}
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Login / Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login/Register Modal */}
      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}
