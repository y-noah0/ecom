import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const orderController = {
  // Create new order
  create: async (req, res) => {
    try {
      const { products, shippingAddress, paymentMethod, totalPrice } = req.body;

      // Create order with correct userId from auth middleware
      const order = new Order({
        userId: req.user.id, // Changed from user.userId to user.id to match auth middleware
        products,
        shippingAddress,
        paymentMethod,
        totalPrice,
        status: 'pending'
      });

      await order.save();
      
      const populatedOrder = await order.populate({
        path: 'products.productId',
        select: 'name price'
      });

      res.status(201).json(populatedOrder);
    } catch (error) {
      console.log('Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  },

  // Get user's orders
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.userId })
        .populate('products.productId')
        .sort('-createdAt');
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get single order
  getOne: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('products.productId') // Ensure this matches the schema
        .populate('user', '-password');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if the user is authorized to view this order
      if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all orders (admin only)
  getAllOrders: async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized. Admin access required.' });
      }

      const orders = await Order.find({})
        .populate('products.productId')
        .populate('userId', 'name email')
        .sort('-createdAt');

      res.json({
        count: orders.length,
        orders: orders
      });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ error: 'Error fetching orders' });
    }
  },

  // Update order status
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;

      // Validate status (ensure it matches allowed values in your schema)
      const allowedStatuses = ['pending', 'processing', 'shipped', 'filled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, updatedAt: Date.now() },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Example error handling in orderController
export const createOrder = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const order = new Order({
      ...req.body,
      userId: req.user.id // Use id from token
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export default orderController;