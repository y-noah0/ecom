import mongoose from 'mongoose';

const PromotionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['price', 'banner'], 
    required: true 
  },
  appliesTo: { 
    type: String, 
    enum: ['product', 'global'], 
    required: true 
  },
  productIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  newPrice: { 
    type: Number 
  },
  title: String,
  description: String,
  image: String,
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model('Promotion', PromotionSchema);