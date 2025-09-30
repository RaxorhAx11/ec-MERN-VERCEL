const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

const getAdminAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all orders
    const allOrders = await Order.find({}).populate('userId', 'name email');
    
    // Filter orders by time range
    const recentOrders = allOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    
    const previousOrders = allOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= prevStartDate && orderDate < startDate;
    });

    // Basic metrics
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Recent period metrics
    const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Growth calculations
    const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const ordersGrowth = previousOrders.length > 0 ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0;

    // Order status distribution
    const orderStatusStats = {
      pending: allOrders.filter(order => order.orderStatus === 'pending').length,
      confirmed: allOrders.filter(order => order.orderStatus === 'confirmed').length,
      inProcess: allOrders.filter(order => order.orderStatus === 'inProcess').length,
      inShipping: allOrders.filter(order => order.orderStatus === 'inShipping').length,
      delivered: allOrders.filter(order => order.orderStatus === 'delivered').length,
      cancelled: allOrders.filter(order => order.orderStatus === 'cancelled').length,
      rejected: allOrders.filter(order => order.orderStatus === 'rejected').length,
    };

    // Customer analytics
    const uniqueCustomers = new Set(allOrders.map(order => order.userId?.toString())).size;
    const customerOrderCounts = {};
    allOrders.forEach(order => {
      const userId = order.userId?.toString();
      if (userId) {
        customerOrderCounts[userId] = (customerOrderCounts[userId] || 0) + 1;
      }
    });
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

    // Product analytics
    const productOrderCounts = {};
    allOrders.forEach(order => {
      order.cartItems?.forEach(item => {
        const productId = item.productId?.toString();
        if (productId) {
          if (!productOrderCounts[productId]) {
            productOrderCounts[productId] = {
              count: 0,
              revenue: 0,
              title: item.title
            };
          }
          productOrderCounts[productId].count += item.quantity;
          productOrderCounts[productId].revenue += item.price * item.quantity;
        }
      });
    });

    const topProducts = Object.entries(productOrderCounts)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly revenue trend (last 12 months)
    const monthlyRevenue = {};
    allOrders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] += order.totalAmount || 0;
      } else {
        monthlyRevenue[monthKey] = order.totalAmount || 0;
      }
    });

    const monthlyTrend = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);

    // Payment method distribution
    const paymentMethodStats = {};
    allOrders.forEach(order => {
      const method = order.paymentMethod || 'unknown';
      paymentMethodStats[method] = (paymentMethodStats[method] || 0) + 1;
    });

    // Recent activity (last 10 orders)
    const recentActivity = allOrders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 10)
      .map(order => ({
        id: order._id,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        customerName: order.userId?.name || 'Unknown',
        customerEmail: order.userId?.email || 'Unknown'
      }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          uniqueCustomers,
          repeatCustomers,
          customerRetention: uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0
        },
        recent: {
          timeRange: days,
          orders: recentOrders.length,
          revenue: recentRevenue,
          revenueGrowth,
          ordersGrowth
        },
        orderStatus: orderStatusStats,
        topProducts,
        monthlyTrend,
        paymentMethods: paymentMethodStats,
        recentActivity,
        completionRate: totalOrders > 0 ? (orderStatusStats.delivered / totalOrders) * 100 : 0,
        cancellationRate: totalOrders > 0 ? ((orderStatusStats.cancelled + orderStatusStats.rejected) / totalOrders) * 100 : 0
      }
    });
  } catch (error) {
    console.log('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};

module.exports = {
  getAdminAnalytics,
};
