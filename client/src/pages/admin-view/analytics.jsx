import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAdminAnalytics } from "@/store/admin/analytics-slice";
import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Target,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  CreditCard,
  Globe
} from "lucide-react";

function AdminAnalytics() {
  const dispatch = useDispatch();
  const { orderList, isLoading: ordersLoading } = useSelector((state) => state.adminOrder);
  const { productList, isLoading: productsLoading } = useSelector((state) => state.adminProducts);
  const { analyticsData, isLoading: analyticsLoading } = useSelector((state) => state.adminAnalytics);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
    dispatch(getAdminAnalytics(timeRange));
  }, [dispatch, timeRange]);

  // Use analytics data when available, fallback to manual calculations
  const totalProducts = productList?.length || 0;
  const totalOrders = analyticsData?.overview?.totalOrders || orderList?.length || 0;
  const totalRevenue = analyticsData?.overview?.totalRevenue || orderList?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const averageOrderValue = analyticsData?.overview?.averageOrderValue || (totalOrders > 0 ? totalRevenue / totalOrders : 0);
  const uniqueCustomers = analyticsData?.overview?.uniqueCustomers || 0;
  const repeatCustomers = analyticsData?.overview?.repeatCustomers || 0;
  const customerRetention = analyticsData?.overview?.customerRetention || 0;

  // Use analytics data for recent metrics
  const recentRevenue = analyticsData?.recent?.revenue || 0;
  const revenueGrowth = analyticsData?.recent?.revenueGrowth || 0;
  const ordersGrowth = analyticsData?.recent?.ordersGrowth || 0;

  // Order status distribution
  const orderStatusStats = analyticsData?.orderStatus || {};
  const pendingOrders = orderStatusStats.pending || 0;
  const confirmedOrders = orderStatusStats.confirmed || 0;
  const inProcessOrders = orderStatusStats.inProcess || 0;
  const inShippingOrders = orderStatusStats.inShipping || 0;
  const deliveredOrders = orderStatusStats.delivered || 0;
  const cancelledOrders = orderStatusStats.cancelled || 0;
  const rejectedOrders = orderStatusStats.rejected || 0;

  // Top performing products from analytics data
  const topProducts = analyticsData?.topProducts || [];

  // Monthly revenue trend from analytics data
  const monthlyTrend = analyticsData?.monthlyTrend || [];

  // Recent orders for activity feed
  const recentOrdersList = analyticsData?.recentActivity || orderList || [];

  // Customer analytics (already calculated above from analytics data)

  // Key metrics cards
  const keyMetrics = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
      changeType: revenueGrowth >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: "text-success",
      description: `vs previous ${timeRange} days`
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth.toFixed(1)}%`,
      changeType: ordersGrowth >= 0 ? "positive" : "negative",
      icon: ShoppingCart,
      color: "text-primary",
      description: `vs previous ${timeRange} days`
    },
    {
      title: "Average Order Value",
      value: `₹${averageOrderValue.toFixed(2)}`,
      change: averageOrderValue > 0 ? "Good AOV" : "No data",
      changeType: averageOrderValue > 0 ? "positive" : "neutral",
      icon: Target,
      color: "text-info",
      description: "Per order average"
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers.toString(),
      change: `${customerRetention.toFixed(1)}% retention`,
      changeType: customerRetention > 20 ? "positive" : "neutral",
      icon: Users,
      color: "text-warning",
      description: "Total customer base"
    }
  ];

  // Order status stats
  const orderStatusData = [
    { label: "Pending", value: pendingOrders, color: "bg-warning/10 text-warning", icon: Clock },
    { label: "Confirmed", value: confirmedOrders, color: "bg-blue-100 text-blue-600", icon: CheckCircle },
    { label: "In Process", value: inProcessOrders, color: "bg-info/10 text-info", icon: Truck },
    { label: "In Shipping", value: inShippingOrders, color: "bg-purple-100 text-purple-600", icon: Truck },
    { label: "Delivered", value: deliveredOrders, color: "bg-success/10 text-success", icon: CheckCircle },
    { label: "Cancelled", value: cancelledOrders, color: "bg-error/10 text-error", icon: AlertTriangle },
    { label: "Rejected", value: rejectedOrders, color: "bg-red-100 text-red-600", icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="admin-badge info">
            {ordersLoading || productsLoading || analyticsLoading ? "Loading..." : "Live Data"}
          </Badge>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="admin-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Time Range:</span>
            <div className="flex gap-2">
              {['7', '30', '90', '365'].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === days
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {days === '365' ? '1 Year' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="admin-stat-label">{metric.title}</p>
                <p className="admin-stat-value">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.changeType === "positive" && <ArrowUpRight className="w-3 h-3 text-success" />}
                  {metric.changeType === "negative" && <ArrowDownRight className="w-3 h-3 text-error" />}
                  <span className={`text-xs ${
                    metric.changeType === "positive" ? "text-success" : 
                    metric.changeType === "negative" ? "text-error" : "text-muted-foreground"
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Trend */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrend.length > 0 ? (
                    monthlyTrend.map(([month, revenue], index) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (revenue / Math.max(...monthlyTrend.map(([,r]) => r))) * 100)}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold">₹{revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No revenue data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatusData.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.color}`}>
                          <status.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status.label === 'Pending' ? 'bg-warning' :
                              status.label === 'In Process' ? 'bg-info' :
                              status.label === 'Delivered' ? 'bg-success' : 'bg-error'
                            }`}
                            style={{ 
                              width: `${totalOrders > 0 ? (status.value / totalOrders) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold">{status.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Orders Activity */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Orders Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrdersList.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order?.id?.slice(-8) || order?._id?.slice(-8) || '—'}</p>
                        <p className="text-sm text-muted-foreground">
                          {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                        <Badge className={`admin-badge ${
                          order.orderStatus === 'delivered' ? 'success' :
                          order.orderStatus === 'pending' ? 'warning' :
                          order.orderStatus === 'confirmed' ? 'info' :
                          order.orderStatus === 'inProcess' ? 'info' :
                          order.orderStatus === 'inShipping' ? 'info' :
                          order.orderStatus === 'cancelled' ? 'error' :
                          order.orderStatus === 'rejected' ? 'error' : 'warning'
                        }`}>
                          {order?.orderStatus || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentOrdersList.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent orders</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Performance Metrics */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Order Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-2xl font-bold text-success">
                      {totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cancellation Rate</span>
                    <span className="text-2xl font-bold text-error">
                      {totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing Time</span>
                    <span className="text-2xl font-bold text-info">2.5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6">
            {/* Top Performing Products */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                          <p className="font-medium">{product.title || 'Unknown Product'}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.count} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{(product?.revenue ?? 0).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No product sales data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Customer Insights */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Customers</span>
                    <span className="text-2xl font-bold text-primary">{uniqueCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Repeat Customers</span>
                    <span className="text-2xl font-bold text-success">{repeatCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Retention</span>
                    <span className="text-2xl font-bold text-info">
                      {customerRetention.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Value Metrics */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Customer Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Customer Value</span>
                    <span className="text-2xl font-bold text-success">
                      ₹{uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers).toFixed(2) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lifetime Value</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers * 1.5).toFixed(2) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New vs Returning</span>
                    <span className="text-2xl font-bold text-info">
                      {uniqueCustomers - repeatCustomers} / {repeatCustomers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminAnalytics;
