import mongoose, { Document, Schema } from 'mongoose';
import { SoftwareProduct as SoftwareProductInterface } from '../data';

// Define the SoftwareProduct document type
export interface SoftwareProductDocument extends Document, Omit<SoftwareProductInterface, 'id'> {
  // id is handled by MongoDB's _id
}

// Define the SoftwareProduct schema
const SoftwareProductSchema = new Schema<SoftwareProductDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Business', 'Creative', 'Productivity', 'Developer', 'Finance']
    },
    price: { type: Number, required: true },
    pricingModel: { 
      type: String, 
      required: true,
      enum: ['Subscription', 'One-Time', 'Freemiun', 'Pay-As-You-Go', 'Monthly', 'Yearly' ],
    },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    logoUrl: { type: String }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret:any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Create and export the SoftwareProduct model
export const SoftwareProduct = mongoose.model<SoftwareProductDocument>('SoftwareProduct', SoftwareProductSchema);
