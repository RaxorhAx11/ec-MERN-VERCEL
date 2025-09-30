import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { getAdminAnalytics } from "@/store/admin/analytics-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Upload,
  Image as ImageIcon,
  BarChart3,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Zap,
  Award,
  Globe,
  CreditCard,
  Truck,
  MessageSquare
} from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
    dispatch(getAdminAnalytics('30'));
  }, [dispatch]);

  // Get real data from Redux store
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);
  const { analyticsData, isLoading: analyticsLoading } = useSelector((state) => state.adminAnalytics);
  
  // Use analytics data when available, fallback to manual calculations
  const totalProducts = productList?.length || 0;
  const totalOrders = analyticsData?.overview?.totalOrders || orderList?.length || 0;
  const totalRevenue = analyticsData?.overview?.totalRevenue || orderList?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const averageOrderValue = analyticsData?.overview?.averageOrderValue || (totalOrders > 0 ? totalRevenue / totalOrders : 0);
  const uniqueCustomers = analyticsData?.overview?.uniqueCustomers || 0;
  const repeatCustomers = analyticsData?.overview?.repeatCustomers || 0;
  const customerRetention = analyticsData?.overview?.customerRetention || 0;
  
  const lowStockProducts = productList?.filter(p => p.totalStock < 10).length || 0;
  const outOfStockProducts = productList?.filter(p => p.totalStock === 0).length || 0;
  
  // Recent activity metrics
  const recentRevenue = analyticsData?.recent?.revenue || 0;
  const revenueGrowth = analyticsData?.recent?.revenueGrowth || 0;
  const ordersGrowth = analyticsData?.recent?.ordersGrowth || 0;
  
  // Order status distribution
  const orderStatusCounts = analyticsData?.orderStatus || {};
  const pendingOrders = orderStatusCounts.pending || 0;
  const confirmedOrders = orderStatusCounts.confirmed || 0;
  const inProcessOrders = orderStatusCounts.inProcess || 0;
  const inShippingOrders = orderStatusCounts.inShipping || 0;
  const deliveredOrders = orderStatusCounts.delivered || 0;
  const cancelledOrders = orderStatusCounts.cancelled || 0;
  const rejectedOrders = orderStatusCounts.rejected || 0;
  
  // Calculate conversion rate based on completed orders vs total orders
  const conversionRate = analyticsData?.completionRate || (totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100) : 0);
  
  // Top performing products (by stock movement)
  const topProducts = productList?.slice(0, 5) || [];
  
  // Recent orders for activity feed
  const recentOrdersList = analyticsData?.recentActivity || orderList?.slice(0, 5) || [];
  
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
      changeType: revenueGrowth >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: "text-success",
      description: "vs previous 30 days"
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth.toFixed(1)}%`,
      changeType: ordersGrowth >= 0 ? "positive" : "negative",
      icon: ShoppingCart,
      color: "text-primary",
      description: "vs previous 30 days"
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
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      change: conversionRate > 80 ? "Excellent" : conversionRate > 60 ? "Good" : "Needs improvement",
      changeType: conversionRate > 60 ? "positive" : "negative",
      icon: TrendingUp,
      color: conversionRate > 60 ? "text-success" : "text-warning",
      description: "Order completion rate"
    }
  ];

  const inventoryStats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-primary",
      progress: 100
    },
    {
      title: "Low Stock",
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: "text-warning",
      progress: totalProducts > 0 ? (lowStockProducts / totalProducts) * 100 : 0
    },
    {
      title: "Out of Stock",
      value: outOfStockProducts.toString(),
      icon: AlertTriangle,
      color: "text-error",
      progress: totalProducts > 0 ? (outOfStockProducts / totalProducts) * 100 : 0
    },
    {
      title: "In Stock",
      value: (totalProducts - lowStockProducts - outOfStockProducts).toString(),
      icon: CheckCircle,
      color: "text-success",
      progress: totalProducts > 0 ? ((totalProducts - lowStockProducts - outOfStockProducts) / totalProducts) * 100 : 0
    }
  ];

  const orderStatusStats = [
    {
      title: "Pending",
      value: pendingOrders.toString(),
      color: "bg-warning/10 text-warning",
      icon: Clock
    },
    {
      title: "Confirmed",
      value: confirmedOrders.toString(),
      color: "bg-blue-100 text-blue-600",
      icon: CheckCircle
    },
    {
      title: "In Process",
      value: inProcessOrders.toString(),
      color: "bg-info/10 text-info",
      icon: Truck
    },
    {
      title: "In Shipping",
      value: inShippingOrders.toString(),
      color: "bg-purple-100 text-purple-600",
      icon: Truck
    },
    {
      title: "Delivered",
      value: deliveredOrders.toString(),
      color: "bg-success/10 text-success",
      icon: CheckCircle
    },
    {
      title: "Cancelled",
      value: cancelledOrders.toString(),
      color: "bg-error/10 text-error",
      icon: AlertTriangle
    },
    {
      title: "Rejected",
      value: rejectedOrders.toString(),
      color: "bg-red-100 text-red-600",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's your store performance overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="admin-badge success">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Badge className="admin-badge info">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="admin-stat-card group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="admin-stat-label">{stat.title}</p>
                  {stat.changeType === "positive" && <ArrowUpRight className="w-4 h-4 text-success" />}
                  {stat.changeType === "negative" && <ArrowDownRight className="w-4 h-4 text-error" />}
                </div>
                <p className="admin-stat-value">{stat.value}</p>
                <p className={`admin-stat-change ${stat.changeType} text-sm`}>
                  {stat.change}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="admin-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrdersList.length > 0 ? (
                    recentOrdersList.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id?.slice(-8) || order._id?.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                            {order.customerName && (
                              <p className="text-xs text-muted-foreground">{order.customerName}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                          <Badge 
                            className={`admin-badge ${
                              order.orderStatus === "delivered" ? "success" :
                              order.orderStatus === "pending" ? "warning" :
                              order.orderStatus === "confirmed" ? "info" :
                              order.orderStatus === "inProcess" ? "info" :
                              order.orderStatus === "inShipping" ? "info" :
                              order.orderStatus === "cancelled" ? "error" :
                              order.orderStatus === "rejected" ? "error" : "warning"
                            }`}
                          >
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Overview */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatusStats.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <status.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{status.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{status.value}</span>
                        <Badge className={status.color}>
                          {status.title}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {inventoryStats.map((stat, index) => (
              <Card key={index} className="admin-stat-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="font-medium">{stat.title}</span>
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.progress.toFixed(1)}% of total inventory
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Products */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{product.price}</p>
                        <Badge 
                          className={`admin-badge ${
                            product.totalStock > 10 ? "success" :
                            product.totalStock > 0 ? "warning" : "error"
                          }`}
                        >
                          {product.totalStock} in stock
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Order Analytics */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Order Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="text-2xl font-bold">{totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-2xl font-bold text-success">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Order Value</span>
                    <span className="text-2xl font-bold">₹{averageOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recent Orders (7 days)</span>
                    <span className="text-2xl font-bold text-primary">{recentOrdersList.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                    <Badge className="admin-badge success">Most Popular</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-info" />
                      <span className="font-medium">PayPal</span>
                    </div>
                    <Badge className="admin-badge info">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Feature Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isCustomStyling={true}
                />
                <Button 
                  onClick={handleUploadFeatureImage} 
                  className="w-full admin-button primary"
                  disabled={!uploadedImageUrl || imageLoadingState}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imageLoadingState ? "Uploading..." : "Upload Image"}
                </Button>
              </CardContent>
            </Card>

            {/* Current Feature Images */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Current Feature Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureImageList && featureImageList.length > 0 ? (
                    featureImageList.map((featureImgItem, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg border border-border">
                        <img
                          src={featureImgItem.image}
                          alt={`Feature ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" className="admin-button secondary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" className="admin-button destructive">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium">Feature Image {index + 1}</p>
                          <p className="text-xs text-muted-foreground">Uploaded recently</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No feature images uploaded yet</p>
                      <p className="text-sm text-muted-foreground">Upload your first feature image to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Quick Actions */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="admin-button outline h-auto p-6 flex flex-col items-center gap-3 group hover:shadow-md transition-all"
              onClick={() => navigate('/admin/products')}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="font-medium block">Manage Products</span>
                <span className="text-sm text-muted-foreground">Add, edit, or remove products</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="admin-button outline h-auto p-6 flex flex-col items-center gap-3 group hover:shadow-md transition-all"
              onClick={() => navigate('/admin/orders')}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="font-medium block">View Orders</span>
                <span className="text-sm text-muted-foreground">Track and manage orders</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="admin-button outline h-auto p-6 flex flex-col items-center gap-3 group hover:shadow-md transition-all"
              onClick={() => navigate('/admin/analytics')}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="font-medium block">Analytics</span>
                <span className="text-sm text-muted-foreground">View detailed analytics</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="admin-button outline h-auto p-6 flex flex-col items-center gap-3 group hover:shadow-md transition-all"
              onClick={() => navigate('/admin/support')}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="font-medium block">Support</span>
                <span className="text-sm text-muted-foreground">Get help and support</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
