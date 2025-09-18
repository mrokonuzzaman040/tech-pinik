import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Slider from '@/models/Slider';

export async function GET() {
  try {
    await connectDB();
    
    const currentDate = new Date();
    
    const sliders = await Slider.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .sort({ sortOrder: 1 })
      .select('-__v');
    
    return NextResponse.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error('Sliders API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch sliders',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}