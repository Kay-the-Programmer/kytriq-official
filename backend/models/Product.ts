import mongoose, { Document, Schema } from 'mongoose';
import { Product as ProductInterface } from '../data';

// Define the Product document type extending both Document and ProductInterface
export interface ProductDocument extends Document, Omit<ProductInterface, 'id'> {
  // id is handled by MongoDB's _id
}

// Define the Product schema
const ProductSchema = new Schema<ProductDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Smartphones', 'Laptops', 'Audio', 'Accessories', 'Apparel']
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    imageUrl: { type: String, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    tags: { 
      type: [String],
      enum: ['Best Seller', 'Selling Fast', 'New Arrival']
    },
    stockStatus: { 
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock']
    },
    colors: [{
      name: { type: String, required: true },
      class: { type: String, required: true }
    }],
    sizes: { type: [String] },
    details: {
      description: { type: String },
      additionalInfo: { type: [String] },
      reviews: [{
        author: { type: String, required: true },
        rating: { type: Number, required: true },
        text: { type: String, required: true }
      }]
    }
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

// Create and export the Product model
export const Product = mongoose.model<ProductDocument>('Product', ProductSchema);
