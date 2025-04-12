import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const cartController = {
  // Get user's cart
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findOne({ user: req.user.id })
        .populate('items.product');
      
      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }
      
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Add item to cart
  addItem: async (req, res) => {
    try {
      const { productId, quantity, color, size } = req.body;

      // Validate product exists and has stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check variant availability
      const variant = product.variants.find(v => 
        v.color === color && v.size === size);
      if (!variant || variant.quantity < quantity) {
        return res.status(400).json({ error: "Product variant not available" });
      }

      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }

      // Update or add item
      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, color, size });
      }

      await cart.save();
      res.json(await cart.populate('items.product'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update cart item
  updateItem: async (req, res) => {
    try {
      const { itemId, quantity } = req.body;
      
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      item.quantity = quantity;
      await cart.save();
      
      res.json(await cart.populate('items.product'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Remove item from cart
  removeItem: async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.items = cart.items.filter(item => 
        item._id.toString() !== req.params.itemId
      );

      await cart.save();
      res.json(await cart.populate('items.product'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.items = [];
      await cart.save();
      
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export default cartController;