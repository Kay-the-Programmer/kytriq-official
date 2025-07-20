import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { User as UserInterface } from '../data';

// Define the User document type with additional methods
export interface UserDocument extends Document, Omit<UserInterface, 'id'> {
  // id is handled by MongoDB's _id
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const UserSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      required: true,
      enum: ['admin', 'customer'],
      default: 'customer'
    },
    memberSince: { type: String, required: true },
    shippingAddress: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret:any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Don't return the password in JSON responses
        delete ret.password;
        return ret;
      }
    }
  }
);

// Add pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    // Add type assertion to tell TypeScript that password is a string
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as Error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

// Create and export the User model
export const User = mongoose.model<UserDocument>('User', UserSchema);
