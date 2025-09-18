import connectDB from './mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Slider from '@/models/Slider';

export async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Slider.deleteMany({});

    // Seed Categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        image: 'https://via.placeholder.com/1200x300/3B82F6/FFFFFF?text=Electronics+Collection',
        icon: 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=📱',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://via.placeholder.com/1200x300/EC4899/FFFFFF?text=Fashion+Collection',
        icon: 'https://via.placeholder.com/80x80/EC4899/FFFFFF?text=👕',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden essentials',
        image: 'https://via.placeholder.com/1200x300/10B981/FFFFFF?text=Home+Garden',
        icon: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=🏠',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: 'https://via.placeholder.com/1200x300/F59E0B/FFFFFF?text=Sports+Collection',
        icon: 'https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=⚽',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Educational and entertainment books',
        image: 'https://via.placeholder.com/1200x300/8B5CF6/FFFFFF?text=Books+Collection',
        icon: 'https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=📚',
        isActive: true,
        sortOrder: 5,
      },
      {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Beauty and personal care products',
        image: 'https://via.placeholder.com/1200x300/EF4444/FFFFFF?text=Beauty+Collection',
        icon: 'https://via.placeholder.com/80x80/EF4444/FFFFFF?text=💄',
        isActive: true,
        sortOrder: 6,
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    // Seed Sliders
    const sliders = [
      {
        title: 'Summer Sale',
        subtitle: 'Up to 50% Off',
        description: 'Get the best deals on electronics and gadgets',
        image: 'https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=Summer+Sale',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        isActive: true,
        sortOrder: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        title: 'New Arrivals',
        subtitle: 'Latest Collection',
        description: 'Discover our newest products and innovations',
        image: 'https://via.placeholder.com/1200x400/10B981/FFFFFF?text=New+Arrivals',
        buttonText: 'Explore',
        buttonLink: '/new-arrivals',
        isActive: true,
        sortOrder: 2,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
      {
        title: 'Winter Collection',
        subtitle: 'Cozy & Warm',
        description: 'Stay warm with our winter essentials',
        image: 'https://via.placeholder.com/1200x400/8B5CF6/FFFFFF?text=Winter+Collection',
        buttonText: 'Shop Winter',
        buttonLink: '/category/fashion',
        isActive: true,
        sortOrder: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
    ];

    await Slider.insertMany(sliders);
    console.log('Sliders seeded successfully');

    // Seed Products
    const electronicsCategory = createdCategories.find(cat => cat.slug === 'electronics');
    const fashionCategory = createdCategories.find(cat => cat.slug === 'fashion');
    const homeCategory = createdCategories.find(cat => cat.slug === 'home-garden');
    const sportsCategory = createdCategories.find(cat => cat.slug === 'sports');
    const booksCategory = createdCategories.find(cat => cat.slug === 'books');
    const beautyCategory = createdCategories.find(cat => cat.slug === 'beauty');

    const products = [
      // Electronics Products
      {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        sku: 'IPH15PM001',
        brand: 'Apple',
        category: electronicsCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=iPhone+15+Pro',
          'https://via.placeholder.com/600x600/1E40AF/FFFFFF?text=iPhone+Back',
        ],
        price: 135000,
        comparePrice: 150000,
        stock: 25,
        lowStockThreshold: 5,
        dimensions: { length: 15.9, width: 7.7, height: 0.83, weight: 221 },
        tags: ['smartphone', 'apple', 'premium', 'camera'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'iPhone 15 Pro Max - Latest Apple Smartphone',
        metaDescription: 'Get the latest iPhone 15 Pro Max with advanced features',
        views: 1250,
        sales: 45,
        rating: 4.8,
        reviewCount: 156,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Premium Android smartphone with S Pen and advanced AI features',
        sku: 'SGS24U001',
        brand: 'Samsung',
        category: electronicsCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Galaxy+S24',
          'https://via.placeholder.com/600x600/059669/FFFFFF?text=S24+Back',
        ],
        price: 125000,
        comparePrice: 140000,
        stock: 18,
        lowStockThreshold: 5,
        dimensions: { length: 16.3, width: 7.9, height: 0.89, weight: 232 },
        tags: ['smartphone', 'samsung', 'android', 's-pen'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Samsung Galaxy S24 Ultra - Premium Android Phone',
        metaDescription: 'Experience the power of Galaxy S24 Ultra with S Pen',
        views: 980,
        sales: 32,
        rating: 4.6,
        reviewCount: 89,
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5-headphones',
        description: 'Industry-leading noise canceling wireless headphones',
        sku: 'SWH1000XM5',
        brand: 'Sony',
        category: electronicsCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Sony+Headphones',
          'https://via.placeholder.com/600x600/DB2777/FFFFFF?text=Headphones+Side',
        ],
        price: 28000,
        comparePrice: 35000,
        stock: 42,
        lowStockThreshold: 10,
        dimensions: { length: 25.4, width: 21.0, height: 8.9, weight: 250 },
        tags: ['headphones', 'wireless', 'noise-canceling', 'premium'],
        isActive: true,
        isFeatured: false,
        metaTitle: 'Sony WH-1000XM5 - Premium Noise Canceling Headphones',
        metaDescription: 'Experience superior sound quality with Sony WH-1000XM5',
        views: 756,
        sales: 67,
        rating: 4.7,
        reviewCount: 234,
      },
      {
        name: 'Apple MacBook Air M3',
        slug: 'apple-macbook-air-m3',
        description: '13-inch MacBook Air with M3 chip, perfect for productivity',
        sku: 'MBAM3001',
        brand: 'Apple',
        category: electronicsCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/6366F1/FFFFFF?text=MacBook+Air',
          'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=MacBook+Open',
        ],
        price: 115000,
        comparePrice: 125000,
        stock: 12,
        lowStockThreshold: 3,
        dimensions: { length: 30.41, width: 21.5, height: 1.13, weight: 1240 },
        tags: ['laptop', 'apple', 'macbook', 'm3-chip'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'MacBook Air M3 - Ultra-thin and Powerful',
        metaDescription: 'Get the new MacBook Air with M3 chip for ultimate performance',
        views: 892,
        sales: 23,
        rating: 4.9,
        reviewCount: 78,
      },

      // Fashion Products
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-t-shirt',
        description: 'Comfortable 100% cotton t-shirt in various colors',
        sku: 'PCT001',
        brand: 'FashionBrand',
        category: fashionCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/EC4899/FFFFFF?text=Cotton+T-Shirt',
          'https://via.placeholder.com/600x600/DB2777/FFFFFF?text=T-Shirt+Back',
        ],
        price: 1200,
        comparePrice: 1500,
        stock: 150,
        lowStockThreshold: 20,
        dimensions: { length: 70, width: 50, height: 1, weight: 200 },
        tags: ['t-shirt', 'cotton', 'casual', 'comfortable'],
        isActive: true,
        isFeatured: false,
        metaTitle: 'Premium Cotton T-Shirt - Comfortable Daily Wear',
        metaDescription: 'High-quality cotton t-shirt for everyday comfort',
        views: 456,
        sales: 89,
        rating: 4.3,
        reviewCount: 67,
      },
      {
        name: 'Slim Fit Denim Jeans',
        slug: 'slim-fit-denim-jeans',
        description: 'Modern slim fit jeans made from premium denim',
        sku: 'SFJ001',
        brand: 'DenimCo',
        category: fashionCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=Denim+Jeans',
          'https://via.placeholder.com/600x600/1E40AF/FFFFFF?text=Jeans+Detail',
        ],
        price: 3500,
        comparePrice: 4200,
        stock: 85,
        lowStockThreshold: 15,
        dimensions: { length: 100, width: 40, height: 2, weight: 600 },
        tags: ['jeans', 'denim', 'slim-fit', 'casual'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Slim Fit Denim Jeans - Modern Style',
        metaDescription: 'Premium denim jeans with perfect slim fit',
        views: 623,
        sales: 54,
        rating: 4.4,
        reviewCount: 92,
      },

      // Home & Garden Products
      {
        name: 'Smart LED Bulb Set',
        slug: 'smart-led-bulb-set',
        description: 'WiFi-enabled smart LED bulbs with color changing features',
        sku: 'SLBS001',
        brand: 'SmartHome',
        category: homeCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Smart+LED+Bulbs',
          'https://via.placeholder.com/600x600/059669/FFFFFF?text=LED+Colors',
        ],
        price: 2500,
        comparePrice: 3000,
        stock: 75,
        lowStockThreshold: 20,
        dimensions: { length: 12, width: 6, height: 6, weight: 150 },
        tags: ['smart-home', 'led', 'wifi', 'lighting'],
        isActive: true,
        isFeatured: false,
        metaTitle: 'Smart LED Bulb Set - WiFi Enabled Lighting',
        metaDescription: 'Transform your home with smart LED bulbs',
        views: 334,
        sales: 76,
        rating: 4.2,
        reviewCount: 45,
      },

      // Sports Products
      {
        name: 'Professional Football',
        slug: 'professional-football',
        description: 'FIFA approved professional football for matches and training',
        sku: 'PF001',
        brand: 'SportsPro',
        category: sportsCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Football',
          'https://via.placeholder.com/600x600/D97706/FFFFFF?text=Football+Detail',
        ],
        price: 1800,
        comparePrice: 2200,
        stock: 60,
        lowStockThreshold: 15,
        dimensions: { length: 22, width: 22, height: 22, weight: 450 },
        tags: ['football', 'sports', 'fifa-approved', 'training'],
        isActive: true,
        isFeatured: false,
        metaTitle: 'Professional Football - FIFA Approved',
        metaDescription: 'High-quality professional football for serious players',
        views: 289,
        sales: 43,
        rating: 4.5,
        reviewCount: 38,
      },

      // Books
      {
        name: 'Programming Fundamentals',
        slug: 'programming-fundamentals',
        description: 'Complete guide to programming fundamentals and best practices',
        sku: 'PF001',
        brand: 'TechBooks',
        category: booksCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/8B5CF6/FFFFFF?text=Programming+Book',
          'https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=Book+Back',
        ],
        price: 1500,
        comparePrice: 1800,
        stock: 95,
        lowStockThreshold: 25,
        dimensions: { length: 24, width: 17, height: 3, weight: 800 },
        tags: ['programming', 'education', 'technology', 'fundamentals'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Programming Fundamentals - Complete Guide',
        metaDescription: 'Master programming with this comprehensive guide',
        views: 567,
        sales: 128,
        rating: 4.6,
        reviewCount: 89,
      },

      // Beauty Products
      {
        name: 'Organic Face Cream',
        slug: 'organic-face-cream',
        description: 'Natural organic face cream for all skin types',
        sku: 'OFC001',
        brand: 'NaturalBeauty',
        category: beautyCategory?._id,
        images: [
          'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Face+Cream',
          'https://via.placeholder.com/600x600/DC2626/FFFFFF?text=Cream+Jar',
        ],
        price: 2200,
        comparePrice: 2800,
        stock: 48,
        lowStockThreshold: 12,
        dimensions: { length: 8, width: 8, height: 6, weight: 150 },
        tags: ['skincare', 'organic', 'face-cream', 'natural'],
        isActive: true,
        isFeatured: false,
        metaTitle: 'Organic Face Cream - Natural Skincare',
        metaDescription: 'Nourish your skin with organic face cream',
        views: 412,
        sales: 67,
        rating: 4.4,
        reviewCount: 56,
      },
    ];

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    return {
      success: true,
      message: 'Database seeded successfully',
      counts: {
        categories: categories.length,
        products: products.length,
        sliders: sliders.length,
      },
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}