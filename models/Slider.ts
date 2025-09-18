import mongoose, { Document, Schema } from 'mongoose';

export interface ISlider extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>({
  title: {
    type: String,
    required: [true, 'Slider title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [150, 'Subtitle cannot exceed 150 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  image: {
    type: String,
    required: [true, 'Slider image is required']
  },
  mobileImage: {
    type: String
  },
  buttonText: {
    type: String,
    trim: true,
    maxlength: [50, 'Button text cannot exceed 50 characters']
  },
  buttonLink: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for better performance
SliderSchema.index({ isActive: 1, sortOrder: 1 });
SliderSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);