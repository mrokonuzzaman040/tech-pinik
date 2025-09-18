import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// GET /api/orders/[orderId] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.orderId)
      .populate('items.product', 'name slug images')
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[orderId] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderStatus, paymentStatus, notes } = body;

    const updateData: Record<string, unknown> = {};
    
    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const order = await Order.findByIdAndUpdate(
      params.orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product', 'name slug images');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}