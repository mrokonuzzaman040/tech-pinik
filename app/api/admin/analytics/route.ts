import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Calculate comparison period for growth metrics
    const comparisonStartDate = new Date(startDate);
    const periodLength = endDate.getTime() - startDate.getTime();
    comparisonStartDate.setTime(startDate.getTime() - periodLength);

    // Get current period data
    const currentPeriodOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Get comparison period data
    const comparisonPeriodOrders = await Order.find({
      createdAt: { $gte: comparisonStartDate, $lt: startDate }
    });

    // Calculate overview metrics
    const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = currentPeriodOrders.length;
    
    const comparisonRevenue = comparisonPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const comparisonOrders = comparisonPeriodOrders.length;

    const revenueGrowth = comparisonRevenue > 0 ? ((totalRevenue - comparisonRevenue) / comparisonRevenue) * 100 : 0;
    const ordersGrowth = comparisonOrders > 0 ? ((totalOrders - comparisonOrders) / comparisonOrders) * 100 : 0;

    // Get unique customers
    const currentCustomers = new Set(currentPeriodOrders.map(order => 
      `${order.shippingAddress.name}-${order.shippingAddress.phone}`
    ));
    const comparisonCustomers = new Set(comparisonPeriodOrders.map(order => 
      `${order.shippingAddress.name}-${order.shippingAddress.phone}`
    ));

    const totalCustomers = currentCustomers.size;
    const customersGrowth = comparisonCustomers.size > 0 ? 
      ((totalCustomers - comparisonCustomers.size) / comparisonCustomers.size) * 100 : 0;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get total products count
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Get top products
    const topProductsData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Get top categories
    const topCategoriesData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      { $unwind: '$productData' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productData.category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: '$categoryData' },
      {
        $group: {
          _id: '$categoryData._id',
          name: { $first: '$categoryData.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('_id shippingAddress.name total orderStatus createdAt');

    // Customer insights
    const allCustomerOrders = await Order.find({
      createdAt: { $gte: comparisonStartDate, $lte: endDate }
    });

    const customerOrderCounts = new Map();
    allCustomerOrders.forEach(order => {
      const customerKey = `${order.shippingAddress.name}-${order.shippingAddress.phone}`;
      customerOrderCounts.set(customerKey, (customerOrderCounts.get(customerKey) || 0) + 1);
    });

    const newCustomers = Array.from(customerOrderCounts.entries()).filter(([_, count]) => count === 1).length;
    const returningCustomers = Array.from(customerOrderCounts.entries()).filter(([_, count]) => count > 1).length;
    
    const customerRetentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
    
    const avgCustomerLifetimeValue = customerOrderCounts.size > 0 ? 
      allCustomerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrderCounts.size : 0;

    // Generate sales chart data (simplified)
    const salesChart = {
      labels: [],
      data: []
    };

    // For now, return mock chart data
    const daysInPeriod = Math.min(30, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    for (let i = daysInPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      salesChart.labels.push(date.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' }));
      
      const dayOrders = currentPeriodOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      salesChart.data.push(dayOrders.reduce((sum, order) => sum + order.total, 0));
    }

    const analyticsData = {
      overview: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        avgOrderValue
      },
      salesChart,
      topProducts: topProductsData,
      topCategories: topCategoriesData,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        customerName: order.shippingAddress.name,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt
      })),
      customerInsights: {
        newCustomers,
        returningCustomers,
        customerRetentionRate,
        avgCustomerLifetimeValue
      }
    };

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
