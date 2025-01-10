import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
}

interface CartContextProps {
  cart: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case "SET_CART":
      return { items: action.payload };
    case "ADD_TO_CART":
      return { items: [...state.items, action.payload] };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.id !== action.payload) };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const { user } = useAuth();

  // Fetch the cart items for the current user
  const fetchCart = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("cart")
      .select("id, product_id, name, weight, price, quantity, image_url")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
    } else {
      dispatch({ type: "SET_CART", payload: data || [] });
    }
  };

  // Add an item to the cart
  const addToCart = async (item: CartItem) => {
    if (!user) return;

    const { error } = await supabase.from("cart").upsert({
      user_id: user.id,
      product_id: item.product_id,
      name: item.name,
      weight: item.weight,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    });

    if (error) {
      console.error("Error adding to cart:", error);
    } else {
      dispatch({ type: "ADD_TO_CART", payload: item });
    }
  };

  // Update the quantity of an item in the cart
  const updateQuantity = async (id: number, quantity: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  // Delete a specific item from the cart
  const deleteItem = async (id: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting item from cart:", error);
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase.from("cart").delete().eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        updateQuantity,
        deleteItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

