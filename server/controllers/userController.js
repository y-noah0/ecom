import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, username, email, password, phone, address } = req.body;
      
      // Validate required fields
      if (!name || !username || !email || !password || !phone) {
        return res.status(400).json({ 
          error: "Missing required fields" 
        });
      }

      // Parse the address string back to object
      const parsedAddress = address ? JSON.parse(address) : null;

      // Handle profile picture upload
      let profilePicture = null;
      if (req.file) {
        profilePicture = req.file.path; // Cloudinary URL
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user with profile picture and address
      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        phone,
        profilePicture, // Add the profile picture URL
        addresses: parsedAddress ? [parsedAddress] : [] // Add address as an array
      });

      // Create token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture
        },
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }

      // Create JWT token - Make sure we use _id instead of id
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      // Change req.user.id to req.user._id to match the token payload
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Prevent password update through this route
        
        // Change req.user.userId to req.user.id
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

// Get user by ID
getUserById: async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'orders',
        select: '_id products status paymentMethod paymentStatus totalPrice createdAt',
        populate: {
          path: 'products.productId',
          select: 'name price image'
        }
      });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},

// Upload profile picture
uploadProfilePicture: async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update user profile with new image URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};

export default userController;