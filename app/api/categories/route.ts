import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('name slug description image icon sortOrder');
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}