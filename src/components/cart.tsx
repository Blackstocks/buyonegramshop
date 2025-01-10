import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { cart, updateQuantity, deleteItem } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (id: number, delta: number) => {
    const currentItem = cart.items.find((item) => item.id === id);
    if (currentItem) {
      const newQuantity = currentItem.quantity + delta;
      if (newQuantity >= 1) {
        await updateQuantity(id, newQuantity);
      }
    }
  };

  const handleDeleteItem = async (id: number) => {
    await deleteItem(id);
  };

  const calculateSubtotal = () =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems: cart.items } });
  };

  if (cart.items.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <p className="mt-4 text-gray-600">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-3xl font-bold">Your Cart</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border-spacing-2">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Item</th>
              <th className="py-2">Price</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Total</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">₹{item.price.toFixed(2)}</td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-2 py-1 text-lg font-bold bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border rounded">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-2 py-1 text-lg font-bold bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4">₹{(item.price * item.quantity).toFixed(2)}</td>
                <td className="py-4">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary */}
      <div className="mt-6 space-y-4 text-right">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-bold">₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full px-6 py-3 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

