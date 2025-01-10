import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const cartItems = location.state?.cartItems || [];
  const singleProduct = location.state?.product || null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "zipCode" && value.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0]?.Status === "Success") {
            const { District, State } = data[0].PostOffice[0];
            setFormData((prev) => ({ ...prev, city: District, state: State }));
          }
        })
        .catch(() =>
          console.error("Failed to fetch city/state from PIN code.")
        );
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      console.error("User not logged in");
      navigate("/login");
      return;
    }

    const orderItems = singleProduct
      ? [
          {
            product_id: singleProduct.id,
            name: singleProduct.name,
            weight: singleProduct.weight,
            price: singleProduct.price,
            quantity: 1,
          },
        ]
      : cartItems;

    if (orderItems.length === 0) {
      console.error("No items to checkout");
      setError("No items to checkout.");
      return;
    }

    if (paymentMethod === "cod") {
      await placeOrderInDatabase(orderItems, "Cash on Delivery");
      setShowPopup(true);
    } else {
      handleOnlinePayment(orderItems);
    }
  };

  const placeOrderInDatabase = async (
    orderItems: any[],
    paymentMethod: string
  ) => {
    try {
      const { error } = await supabase.from("orders").insert(
        orderItems.map((item: any) => ({
          user_id: user.id,
          product_id: item.product_id,
          name: item.name,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity,
          shipping_info: formData,
          payment_method: paymentMethod,
        }))
      );

      if (error) {
        console.error("Error placing order:", error);
        setError("Failed to place order. Please try again.");
      } else {
        console.log("Order placed successfully");

        // Clear the cart in the database and context
        const { error: clearCartError } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user.id);

        if (clearCartError) {
          console.error("Error clearing cart after order:", clearCartError);
        } else {
          console.log("Cart cleared successfully after order");
          await clearCart(); // Update the local context state
        }

        if (paymentMethod === "Cash on Delivery") {
          setShowPopup(true);
        } else {
          alert("Order placed successfully with Online Payment!");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Unexpected error while placing order:", err);
      setError("Unexpected error occurred. Please try again.");
    }
  };

  const handleOnlinePayment = (orderItems: any[]) => {
    const totalPrice = calculateTotalPrice();
    const options = {
      key: "RAZORPAY_KEY", // Replace with your Razorpay key
      amount: totalPrice * 100, // Convert to paise
      currency: "INR",
      name: "Grocery Store",
      description: "Order Payment",
      handler: async (response: any) => {
        console.log("Payment successful:", response);
        await placeOrderInDatabase(orderItems, "Online Payment");
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const calculateTotalPrice = () => {
    return (
      (singleProduct
        ? singleProduct.price
        : cartItems.reduce((acc: number, item: any) => acc + item.price, 0)) + 50
    );
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Checkout</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Billing Information */}
        <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-8">
          <h3 className="mb-4 text-lg font-semibold">Shipping Information</h3>
          <form>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 mt-4 border rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 mt-4 border rounded"
              required
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <input
              type="text"
              name="country"
              value="India"
              disabled
              className="w-full p-3 mt-4 bg-gray-100 border rounded"
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-4">
          <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
          {singleProduct ? (
            <div className="flex justify-between mb-4">
              <div>
                <h4>{singleProduct.name}</h4>
                <p>{singleProduct.weight}</p>
              </div>
              <p>₹{singleProduct.price.toFixed(2)}</p>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <div key={item.id} className="flex justify-between mb-4">
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.weight}</p>
                </div>
                <p>₹{item.price.toFixed(2)}</p>
              </div>
            ))
          )}
          <hr className="my-4" />
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice - 50}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery</span>
            <span>₹50</span>
          </p>
          <hr className="my-4" />
          <p className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </p>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-md">Payment Method</h3>
            <label className="block">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{" "}
              Cash on Delivery
            </label>
            <label className="block">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{" "}
              Online Payment
            </label>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {showPopup && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
              Order Placed Successfully!
            </h3>
            <p>Thank you for your purchase.</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

