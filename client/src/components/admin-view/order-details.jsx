import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { 
  Package, 
  CreditCard, 
  MapPin, 
  Calendar, 
  User, 
  Phone,
  Mail,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "rejected":
        return "error";
      case "inProcess":
      case "inShipping":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-muted-foreground">Order #{orderDetails?._id?.slice(-8)}</p>
          </div>
          <Badge 
            className={`admin-badge ${getStatusColor(orderDetails?.orderStatus)}`}
          >
            {getStatusIcon(orderDetails?.orderStatus)}
            <span className="ml-1 capitalize">{orderDetails?.orderStatus}</span>
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Information */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                  <p className="font-medium">{orderDetails?.orderDate?.split("T")[0]}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                  <p className="font-bold text-lg">₹{orderDetails?.totalAmount}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                  <p className="font-medium">{orderDetails?.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Status</Label>
                  <Badge 
                    className={`admin-badge ${
                      orderDetails?.paymentStatus === "paid" ? "success" : "warning"
                    }`}
                  >
                    {orderDetails?.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{user?.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{orderDetails?.addressInfo?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user?.email || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Address */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{orderDetails?.addressInfo?.address}</p>
              <p className="text-muted-foreground">
                {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
              </p>
              {orderDetails?.addressInfo?.notes && (
                <p className="text-sm text-muted-foreground">
                  <strong>Notes:</strong> {orderDetails?.addressInfo?.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.price}</p>
                        <p className="text-sm text-muted-foreground">per item</p>
                      </div>
                    </div>
                  ))
                : <p className="text-muted-foreground text-center py-8">No items found</p>}
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Update Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText="Update Order Status"
              onSubmit={handleUpdateStatus}
            />
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
