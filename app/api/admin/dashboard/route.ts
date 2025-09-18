import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total counts
    const [totalProducts, totalOrders, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().populate('items.product', 'name slug images').lean()
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get unique customers (based on phone numbers)
    const uniquePhones = new Set(orders.map(order => order.shippingAddress.phone));
    const totalCustomers = uniquePhones.size;

    // Get current month stats
    const currentMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= firstDayOfMonth
    );
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Get last month stats for comparison
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= firstDayOfLastMonth && orderDate <= lastDayOfLastMonth;
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate percentage changes
    const ordersChange = lastMonthOrders.length > 0 
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : 0;
    
    const revenueChange = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    // Get recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.name,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt
      }));

    const dashboardStats = {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      monthlyStats: {
        orders: currentMonthOrders.length,
        revenue: currentMonthRevenue,
        ordersChange: Math.round(ordersChange * 100) / 100,
        revenueChange: Math.round(revenueChange * 100) / 100
      }
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}