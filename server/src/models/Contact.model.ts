import mongoose, { Schema } from 'mongoose';
import { IContact } from '@/types';

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  subject: {
    type: String,
    enum: ['general', 'demo', 'support', 'partnership'],
    default: 'general'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
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
contactSchema.index({ email: 1 });
contactSchema.index({ userId: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ 
  email: 1, 
  createdAt: -1 
});

// Static methods
contactSchema.statics.findByEmail = function(email: string) {
  return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

contactSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

contactSchema.statics.findUnread = function() {
  return this.find({ isRead: false }).sort({ createdAt: -1 });
};

// Instance methods
contactSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.status = 'read';
  return this.save();
};

contactSchema.methods.markAsReplied = function() {
  this.status = 'replied';
  return this.save();
};

contactSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Virtual for time ago
contactSchema.virtual('timeAgo').get(function() {
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

// Virtual for message preview
contactSchema.virtual('messagePreview').get(function() {
  if (this.message.length <= 100) {
    return this.message;
  }
  return this.message.substring(0, 100) + '...';
});

// Pre-save middleware
contactSchema.pre('save', async function(next) {
  if (!this.isModified('email')) {
    return next();
  }
  
  // Ensure email is lowercase
  this.email = this.email.toLowerCase();
  next();
});

// Ensure virtuals are included in JSON
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
