import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String,
    required: true
  }],
  price: { 
    type: Number, 
    required: true 
  },
  tags: [{ 
    type: String 
  }],
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  variants: [{
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  inStock: { 
    type: Boolean, 
    default: true 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  numReviews: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);
