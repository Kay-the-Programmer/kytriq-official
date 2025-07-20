import mongoose, { Document, Schema } from 'mongoose';
import { Order as OrderInterface } from '../data';


// Define the Order document type with modified userId type
export interface OrderDocument extends Omit<OrderInterface, 'id' | 'userId'>, Document {
    // id is handled by MongoDB's _id
    userId: string; // Changed to string to match User model's string _id
}

// Define the Order schema
const OrderSchema = new Schema<OrderDocument>(
  {
    _id: { type: String },
    date: { type: String, required: true },
    customerName: { type: String, required: true },
      userId: {
          type: String,  // Changed to String to match User model's string _id
          ref: 'User',
          required: true
      },
    status: { 
      type: String, 
      required: true,
      enum: ['Delivered', 'Processing', 'Shipped', 'Cancelled'],
      default: 'Processing'
    },
    items: [{
      // Store product details at the time of order
      id: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      images: { type: [String], required: true },
      description: { type: String, required: true },
      rating: { type: Number, required: true },
      reviewCount: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    total: { type: Number, required: true }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Create and export the Order model
export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);
