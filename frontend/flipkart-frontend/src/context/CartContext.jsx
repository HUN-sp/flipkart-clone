import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], summary: { totalItems: 0, total: '0.00' } });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add(productId, quantity);
      if (data.success) {
        await fetchCart();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to cart';
      return { success: false, message };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const { data } = await cartAPI.update(cartItemId, quantity);
      if (data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: data.error };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update cart';
      return { success: false, message };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { data } = await cartAPI.remove(cartItemId);
      if (data.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: data.error };
    } catch (error) {
      return { success: false, message: 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart: fetchCart,
      cartCount: cart.summary?.totalItems || 0
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
