"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const contactSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        transform: function (doc, ret) {
            if (ret.__v !== undefined) {
                delete ret.__v;
            }
            return ret;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            if (ret.__v !== undefined) {
                delete ret.__v;
            }
            return ret;
        }
    }
});
contactSchema.index({ email: 1 });
contactSchema.index({ userId: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({
    email: 1,
    createdAt: -1
});
contactSchema.statics.findByEmail = function (email) {
    return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};
contactSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
contactSchema.statics.findUnread = function () {
    return this.find({ isRead: false }).sort({ createdAt: -1 });
};
contactSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.status = 'read';
    return this.save();
};
contactSchema.methods.markAsReplied = function () {
    this.status = 'replied';
    return this.save();
};
contactSchema.methods.archive = function () {
    this.status = 'archived';
    return this.save();
};
contactSchema.virtual('timeAgo').get(function () {
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
contactSchema.virtual('messagePreview').get(function () {
    if (this.message.length <= 100) {
        return this.message;
    }
    return this.message.substring(0, 100) + '...';
});
contactSchema.pre('save', async function (next) {
    if (!this.isModified('email')) {
        return next();
    }
    this.email = this.email.toLowerCase();
    next();
});
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });
exports.Contact = mongoose_1.default.model('Contact', contactSchema);
exports.default = exports.Contact;
//# sourceMappingURL=Contact.model.js.map