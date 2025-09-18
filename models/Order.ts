import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  district: string;
  area?: string;
  landmark?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'bkash' | 'nagad' | 'rocket';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v: string) {
        // Bangladeshi phone number validation
        return /^(\+88)?01[3-9]\d{8}$/.test(v);
      },
      message: 'Please enter a valid Bangladeshi phone number'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bkash', 'nagad', 'rocket'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Create indexes for better performance
// Note: orderNumber index is automatically created by unique: true
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'shippingAddress.phone': 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);