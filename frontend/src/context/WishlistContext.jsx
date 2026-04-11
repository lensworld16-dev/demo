import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistAPI.get();
      setWishlist(data.items || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to save wishlist');
      return;
    }

    const isExist = wishlist.some(item => item.id === product.id);
    
    try {
      if (isExist) {
        await wishlistAPI.remove(product.id);
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add(product.id);
        setWishlist(prev => [...prev, product]);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      loading, 
      wishlistCount: wishlist.length,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      refreshWishlist: loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
