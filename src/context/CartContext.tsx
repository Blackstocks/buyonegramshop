import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  weight: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartContextProps {
  cart: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { items: action.payload };
    case 'ADD_TO_CART':
      return { items: [...state.items, action.payload] };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const { user } = useAuth();

  // Fetch Cart for Current User
  const fetchCart = async () => {
    try {
      if (!user) return;
  
      const { data, error } = await supabase
        .from('cart')
        .select('id, product_id, name, weight, price, quantity')
        .eq('user_id', user.id);
  
      if (error) {
        console.error('Error fetching cart:', error);
      } else {
        dispatch({ type: 'SET_CART', payload: data || [] });
      }
    } catch (err) {
      console.error('Unexpected error while fetching cart:', err);
    }
  };

  

  // Add to Cart and Store in Database
  const addToCart = async (item: CartItem) => {
    if (!user) return;

    const { error } = await supabase.from('cart').upsert({
      user_id: user.id,
      product_id: item.product_id,
      name: item.name,
      weight: item.weight,
      price: item.price,
      quantity: item.quantity,
    });

    if (error) {
      console.error('Error adding to cart:', error);
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: item });
    }
  };

  // Clear Cart from State and Database
  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase.from('cart').delete().eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
