// models/Cart.js
import e from 'express';
import mongoose from 'mongoose';
const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Cart', CartSchema);