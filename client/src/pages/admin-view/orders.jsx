import AdminOrdersView from "@/components/admin-view/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { useEffect } from "react";
import { ShoppingCart, TrendingUp, AlertCircle, Package } from "lucide-react";

function AdminOrders() {
  const dispatch = useDispatch();
  const { orderList, isLoading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Calculate real stats from order data
  const totalOrders = orderList?.length || 0;
  const totalRevenue = orderList?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const pendingOrders = orderList?.filter(order => order.orderStatus === "pending").length || 0;
  const completedOrders = orderList?.filter(order => order.orderStatus === "delivered").length || 0;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-primary"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: AlertCircle,
      color: "text-warning"
    },
    {
      title: "Completed Orders",
      value: completedOrders.toString(),
      icon: Package,
      color: "text-info"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Badge className="admin-badge info">
          {isLoading ? "Loading..." : `${totalOrders} orders`}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">{stat.title}</p>
                <p className="admin-stat-value">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <AdminOrdersView />
    </div>
  );
}

export default AdminOrders;
