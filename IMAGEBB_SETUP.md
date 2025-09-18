# ImageBB Setup Guide

This application uses ImageBB for image hosting. Follow these steps to set up image uploads:

## 1. Get ImageBB API Key

1. Go to [ImageBB API](https://api.imgbb.com/)
2. Sign up for a free account
3. Navigate to your API section
4. Copy your API key

## 2. Configure Environment Variables

Add your ImageBB API key to `.env.local`:

```env
# ImageBB API Configuration
NEXT_PUBLIC_IMAGEBB_API_KEY=your_actual_api_key_here
```

## 3. Features

### Image Upload Component
- **Drag & Drop**: Drag images directly onto the upload area
- **Multiple Images**: Support for multiple image uploads (configurable)
- **File Validation**: Automatic validation for file type and size
- **Preview**: Real-time preview of uploaded images
- **Remove Images**: Easy removal of uploaded images
- **Copy URLs**: Click on image URLs to copy to clipboard

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- Maximum file size: 10MB per image

### Admin Integration
- **Product Images**: Upload multiple product images
- **Category Images**: Upload category banner images
- **Automatic Integration**: Images are automatically added to forms

## 4. Usage in Admin

### Creating Products
1. Go to `/admin/products/new`
2. Fill in product details
3. Use the image upload section to add product images
4. Images are automatically saved to ImageBB and URLs stored in database

### Creating Categories
1. Go to `/admin/categories/new`
2. Fill in category details
3. Upload a category banner image (optional)
4. Choose an emoji icon for the category

## 5. Troubleshooting

### "ImageBB API key not configured" Error
- Make sure you've added the API key to `.env.local`
- Restart your development server after adding the key
- Ensure the key starts with `NEXT_PUBLIC_` for client-side access

### Upload Failures
- Check your internet connection
- Verify the API key is correct
- Ensure file size is under 10MB
- Check that file format is supported

## 6. Free Tier Limits

ImageBB free tier includes:
- Unlimited image hosting
- 32MB max file size
- No bandwidth limits
- Permanent image hosting

Perfect for development and small to medium applications!
