import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/review.js';
import Category from '../models/Category.js';

export const filterProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      colors,
      sizes,
      sort,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};
    
    if (category) {
      // First, try to find the category and log the search attempt
      console.log('Searching for category:', category);
      
      const categoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(category, 'i') }},
          { slug: { $regex: new RegExp(category, 'i') }}
        ]
      });

      console.log('Found category:', categoryDoc);

      if (!categoryDoc) {
        // List all available categories for debugging
        const allCategories = await Category.find({}, 'name slug');
        console.log('Available categories:', allCategories);
        return res.status(404).json({ 
          error: 'Category not found',
          availableCategories: allCategories
        });
      }

      filter.category = categoryDoc._id;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice); 
    }

    if (colors) {
      filter['variants.color'] = { $in: colors.split(',') };
    }

    if (sizes) {
      filter['variants.size'] = { $in: sizes.split(',') };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }}
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    let sortObj = {};
    switch(sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('category');

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ error: error.message });
  }
};

const productController = {
  // Create product
  createProduct: async (req, res) => {
    try {
      // Validate required fields
      const { name, description, price, categoryId } = req.body;
      let variants = [];
      
      // Parse variants if it's a string
      if (typeof req.body.variants === 'string') {
        variants = JSON.parse(req.body.variants);
      } else {
        variants = req.body.variants;
      }

      if (!name || !description || !price || !categoryId || !variants) {
        return res.status(400).json({ 
          error: "Missing required fields" 
        });
      }

      // Handle multiple image uploads
      let images = [];
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => file.path);
      } else {
        return res.status(400).json({
          error: "At least one product image is required"
        });
      }

      // Create the product with properly parsed variants
      const product = await Product.create({
        name,
        description,
        price,
        category: categoryId,
        images,
        variants: variants // Now it's an array of objects
      });

      const populatedProduct = await product.populate('category');
      res.status(201).json(populatedProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('category')
        .sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get single product
  getOne: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category')
        .populate({
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'username'
          }
        });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update product
  update: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete product
  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Filter products
  filterProducts: async (req, res) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        colors,
        sizes,
        sort,
        search,
        page = 1,
        limit = 12
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (category) {
        // First, try to find the category and log the search attempt
        console.log('Searching for category:', category);
        
        const categoryDoc = await Category.findOne({
          $or: [
            { name: { $regex: new RegExp(category, 'i') }},
            { slug: { $regex: new RegExp(category, 'i') }}
          ]
        });

        console.log('Found category:', categoryDoc);

        if (!categoryDoc) {
          // List all available categories for debugging
          const allCategories = await Category.find({}, 'name slug');
          console.log('Available categories:', allCategories);
          return res.status(404).json({ 
            error: 'Category not found',
            availableCategories: allCategories
          });
        }

        filter.category = categoryDoc._id;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice); 
      }

      if (colors) {
        filter['variants.color'] = { $in: colors.split(',') };
      }

      if (sizes) {
        filter['variants.size'] = { $in: sizes.split(',') };
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' }},
          { description: { $regex: search, $options: 'i' }}
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Build sort object
      let sortObj = {};
      switch(sort) {
        case 'price_asc':
          sortObj = { price: 1 };
          break;
        case 'price_desc':
          sortObj = { price: -1 };
          break;
        case 'newest':
          sortObj = { createdAt: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('category');

      res.json({
        products,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Filter error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default productController;