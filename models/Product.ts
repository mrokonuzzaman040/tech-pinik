import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  brand: string;
  category: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  sales: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create indexes for better performance
// Note: slug index is automatically created by unique: true
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);