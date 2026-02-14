import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '@/types';

const userSchema = new Schema<IUser>({
  googleId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      if (ret.__v !== undefined) {
        delete (ret as any).__v;
      }
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret: any) {
      if (ret.__v !== undefined) {
        delete (ret as any).__v;
      }
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Static methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByGoogleId = function(googleId: string) {
  return this.findOne({ googleId });
};

// Instance methods
userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  return {
    _id: user._id,
    googleId: user.googleId,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('email')) {
    return next();
  }
  
  // Ensure email is lowercase
  this.email = this.email.toLowerCase();
  next();
});

// Virtual for time ago
userSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = mongoose.model<IUser>('User', userSchema);
export default User;
