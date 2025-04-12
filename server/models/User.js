import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  color: String,
  size: String
});

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String
});

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profilePicture: {
    type: String, // URL or file path to the profile picture
    default: '' // Optional: set a default value
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  orders: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  }],
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  cart: [CartItemSchema],
  addresses: [AddressSchema]
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);
