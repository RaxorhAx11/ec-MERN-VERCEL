import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { ShoppingCart } from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          All Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderList && orderList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell className="font-medium">
                      #{orderItem._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {new Date(orderItem.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`admin-badge ${
                          orderItem.orderStatus === "delivered" ? "success" :
                          orderItem.orderStatus === "rejected" ? "error" :
                          orderItem.orderStatus === "pending" ? "warning" : "info"
                        }`}
                      >
                        {orderItem.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{orderItem.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`admin-badge ${
                          orderItem.paymentStatus === "paid" ? "success" : "warning"
                        }`}
                      >
                        {orderItem.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          variant="outline"
                          size="sm"
                          className="admin-button outline"
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
