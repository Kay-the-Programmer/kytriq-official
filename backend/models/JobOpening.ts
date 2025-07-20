import mongoose, { Document, Schema } from 'mongoose';
import { JobOpening as JobOpeningInterface } from '../data';

// Define the JobOpening document type
export interface JobOpeningDocument extends Document, Omit<JobOpeningInterface, 'id'> {
  // id is handled by MongoDB's _id
}

// Define the JobOpening schema
const JobOpeningSchema = new Schema<JobOpeningDocument>(
  {
    _id: { type: String },
    title: { type: String, required: true },
    department: { 
      type: String, 
      required: true,
      enum: ['Engineering', 'Design', 'Marketing', 'Product']
    },
    location: { 
      type: String, 
      required: true,
      enum: ['Remote', 'San Francisco, CA', 'New York, NY', 'Hybrid']
    },
    type: { 
      type: String, 
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract']
    },
    description: { type: String, required: true },
    responsibilities: { type: [String], required: true },
    qualifications: { type: [String], required: true }
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

// Create and export the JobOpening model
export const JobOpening = mongoose.model<JobOpeningDocument>('JobOpening', JobOpeningSchema);
