// src/context/cart-context.js
import PropTypes from 'prop-types';
import { createContext } from 'react';
import { useCart as useCartQuery } from '../Hooks/useCart';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation,
    updateQuantity: updateQuantityMutation,
    removeFromCart: removeFromCartMutation,
    clearCart: clearCartMutation
  } = useCartQuery();

  const addToCart = async (product) => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        quantity: product.quantity || 1
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateQuantityMutation.mutateAsync({ productId, quantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartMutation.mutateAsync(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cart?.items?.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0) || 0;
  };

  // Add the missing getCartItemCount function
  const getCartItemCount = () => {
    return cart?.items?.reduce((total, item) => {
      return total + item.quantity;
    }, 0) || 0;
  };

  // For removing a single item, not the entire product quantity
  const removeItemFromCart = async (productId) => {
    try {
      const existingItem = cart?.items?.find(item => item.product._id === productId);
      if (existingItem && existingItem.quantity > 1) {
        await updateQuantityMutation.mutateAsync({ 
          productId, 
          quantity: existingItem.quantity - 1 
        });
      } else {
        await removeFromCartMutation.mutateAsync(productId);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const value = {
    cartItems: cart?.items || [],
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount // Include the function in the context value
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};