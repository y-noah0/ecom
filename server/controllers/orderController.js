import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';

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
        .populate('products.productId')
        .populate('userId', '-password'); // Changed from 'user' to 'userId'

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if the user is authorized to view this order
      if (order.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
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

      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter object
      let filter = {};

      // Status filter
      if (req.query.status) {
        filter.status = req.query.status;
      }

      // Date range filter
      if (req.query.startDate || req.query.endDate) {
        filter.createdAt = {};
        if (req.query.startDate) {
          filter.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          filter.createdAt.$lte = new Date(req.query.endDate);
        }
      }

      // Price range filter
      if (req.query.minPrice || req.query.maxPrice) {
        filter.totalPrice = {};
        if (req.query.minPrice) {
          filter.totalPrice.$gte = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
          filter.totalPrice.$lte = parseFloat(req.query.maxPrice);
        }
      }

      // Search by customer name or email
      if (req.query.search) {
        const userIds = await User.find({
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }).distinct('_id');
        filter.userId = { $in: userIds };
      }

      try {
        // Get total count for pagination
        const totalOrders = await Order.countDocuments(filter);

        // Get filtered orders
        const orders = await Order.find(filter)
          .populate({
            path: 'userId',
            select: 'name email'
          })
          .populate('products.productId')
          .sort({ [req.query.sortBy || 'createdAt']: parseInt(req.query.sortOrder) || -1 })
          .skip(skip)
          .limit(limit);

        return res.json({
          orders,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            hasMore: skip + orders.length < totalOrders
          }
        });
      } catch (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
    } catch (error) {
      console.error('General error:', error);
      return res.status(500).json({ error: error.message });
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