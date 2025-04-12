import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  size: String,
  color: String,
  priceAtPurchase: { 
    type: Number, 
    required: true 
  }
});

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [OrderItemSchema],
  status: { 
    type: String, 
    enum: ['pending', 'filled', 'canceled'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'mobile_money', 'PayOnDelivery'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'unpaid', 'refunded'], 
    default: 'unpaid' 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  transactionId: String,
  hasCoupon: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
