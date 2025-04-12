import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String 
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
  // Add reviews field
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  variants: [{
    color: String,
    size: String,
    quantity: Number
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
