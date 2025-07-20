import mongoose, { Document, Schema } from 'mongoose';
import { BlogPost as BlogPostInterface } from '../data';

// Define the BlogPost document type
export interface BlogPostDocument extends Document, Omit<BlogPostInterface, 'id'> {
  // id is handled by MongoDB's _id
}

// Define the BlogPost schema
const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    _id: { type: String },
    title: { type: String, required: true },
    author: { type: String, required: true },
    authorAvatarUrl: { type: String, required: true },
    date: { type: String, required: true },
    tags: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }
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

// Create and export the BlogPost model
export const BlogPost = mongoose.model<BlogPostDocument>('BlogPost', BlogPostSchema);
