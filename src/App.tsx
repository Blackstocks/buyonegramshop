import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductFilterProvider } from "./context/ProductFilterContext";
import RequireAdmin from "./components/RequireAdmin"; // Secure admin route
import Footer from "./components/footer";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductFilterProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container px-4 py-8 mx-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminDashboard />
                      </RequireAdmin>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <Toaster /> {/* Add this */}
            </div>
          </BrowserRouter>
        </ProductFilterProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
