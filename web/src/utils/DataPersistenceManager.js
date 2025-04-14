import { cartService } from '../Services/Api';

class DataPersistenceManager {
  static GUEST_CART_KEY = 'guest_cart';
  static GUEST_WISHLIST_KEY = 'guest_wishlist';

  static async handleAuthStateChange(isAuthenticated) {
    if (isAuthenticated) {
      await this.mergeGuestData();
    }
  }

  static async mergeGuestData() {
    try {
      await this.mergeGuestCart();
      await this.mergeGuestWishlist();
      this.clearGuestData();
    } catch (error) {
      console.error('Error merging guest data:', error);
    }
  }

  static async mergeGuestCart() {
    const guestCart = this.getGuestCart();
    if (guestCart && guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await cartService.addToCart({
            productId: item.id,
            quantity: item.quantity
          });
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      }
    }
  }

  static async mergeGuestWishlist() {
    const guestWishlist = this.getGuestWishlist();
    if (guestWishlist && guestWishlist.length > 0) {
      // The wishlist merge implementation will depend on your wishlist service structure
      // This is a placeholder for the actual implementation
    }
  }

  static getGuestCart() {
    try {
      const cartData = localStorage.getItem(this.GUEST_CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch {
      return [];
    }
  }

  static getGuestWishlist() {
    try {
      const wishlistData = localStorage.getItem(this.GUEST_WISHLIST_KEY);
      return wishlistData ? JSON.parse(wishlistData) : [];
    } catch {
      return [];
    }
  }

  static clearGuestData() {
    localStorage.removeItem(this.GUEST_CART_KEY);
    localStorage.removeItem(this.GUEST_WISHLIST_KEY);
  }
}

export default DataPersistenceManager;