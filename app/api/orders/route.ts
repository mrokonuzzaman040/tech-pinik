import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const orderData = await request.json();
    
    // Generate order number
    const orderNumber = `TP${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Transform the data to match our Order model
    const transformedOrder = {
      orderNumber,
      items: orderData.items.map((item: { productId: string; name: string; image: string; price: number; quantity: number }) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      shippingAddress: {
        name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        phone: orderData.customer.phone,
        address: orderData.shipping.address,
        district: orderData.shipping.district,
        area: orderData.shipping.city,
      },
      subtotal: orderData.totals.subtotal,
      shippingCost: orderData.totals.shipping,
      total: orderData.totals.total,
      paymentMethod: orderData.payment.method === 'cod' ? 'cash_on_delivery' : orderData.payment.method,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes: orderData.notes || '',
    };
    
    const order = new Order(transformedOrder);
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderNumber,
        orderDetails: order,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.orderStatus = status;
    if (phone) filter['shippingAddress.phone'] = { $regex: phone, $options: 'i' };
    
    const orders = await Order.find(filter)
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Order.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}