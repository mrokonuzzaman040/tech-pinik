import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    
    // Get unique brands from products
    const brands = await Product.distinct('brand');
    
    // Filter out empty or null brands and sort alphabetically
    const filteredBrands = brands
      .filter(brand => brand && brand.trim() !== '')
      .sort();

    return NextResponse.json({
      success: true,
      data: filteredBrands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}