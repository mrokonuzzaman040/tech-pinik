import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build aggregation pipeline to get customer data from orders
    const matchStage: any = {};
    
    if (search) {
      matchStage.$or = [
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            name: '$shippingAddress.name',
            phone: '$shippingAddress.phone'
          },
          email: { $first: '$shippingAddress.email' },
          phone: { $first: '$shippingAddress.phone' },
          address: { $first: '$shippingAddress' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          lastOrderDate: { $max: '$createdAt' },
          createdAt: { $min: '$createdAt' },
          isActive: { $first: true },
          status: { $first: 'active' }
        }
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          name: '$_id.name',
          email: '$email',
          phone: '$phone',
          address: '$address',
          totalOrders: 1,
          totalSpent: 1,
          lastOrderDate: 1,
          createdAt: 1,
          isActive: 1,
          status: 1
        }
      },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    ];

    const customers = await Order.aggregate(pipeline);
    
    // Get total count
    const totalCountPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            name: '$shippingAddress.name',
            phone: '$shippingAddress.phone'
          }
        }
      },
      { $count: 'total' }
    ];

    const totalCountResult = await Order.aggregate(totalCountPipeline);
    const total = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
