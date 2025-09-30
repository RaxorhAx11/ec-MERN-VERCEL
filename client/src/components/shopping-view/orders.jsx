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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="bg-white border-[#6793AC]/20 shadow-md rounded-xl font-poppins relative overflow-hidden animate-zoom-in">
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.3" className="wave-1" />
          <path d="M0,40 C400,20 800,60 1200,20 C1320,0 1440,40 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.2" className="wave-2" />
        </svg>
      </div>
      <CardHeader className="z-10">
        <CardTitle className="text-xl font-bold text-[#114AB1]">Order History</CardTitle>
      </CardHeader>
      <CardContent className="z-10">
        {orderList && orderList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#6793AC]/10">
                  <TableHead className="text-[#114AB1] text-sm font-semibold">Order ID</TableHead>
                  <TableHead className="text-[#114AB1] text-sm font-semibold">Date</TableHead>
                  <TableHead className="text-[#114AB1] text-sm font-semibold">Status</TableHead>
                  <TableHead className="text-[#114AB1] text-sm font-semibold">Amount</TableHead>
                  <TableHead className="text-[#114AB1] text-sm font-semibold">Payment</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((orderItem, idx) => (
                  <TableRow 
                    key={orderItem._id} 
                    className="hover:bg-[#6793AC]/10 transition-colors duration-200" 
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <TableCell className="text-sm text-gray-600 font-mono">
                      {orderItem?._id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(orderItem?.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`py-1 px-3 text-xs font-medium ${
                          orderItem?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                          orderItem?.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          orderItem?.orderStatus === 'delivered' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {orderItem?.orderStatus?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-[#114AB1]">
                      ${orderItem?.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`py-1 px-2 text-xs font-medium capitalize ${
                          orderItem?.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                          orderItem?.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {orderItem?.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          size="sm"
                          className="bg-[#114AB1] hover:bg-[#114AB1]/90 text-white text-xs py-1 px-3 rounded-md transition-all duration-200 hover:scale-105"
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
          </div>
        )}
      </CardContent>
      <style>{`
        .wave-1 { animation: wave1 6s ease-in-out infinite; }
        .wave-2 { animation: wave2 8s ease-in-out infinite; }
        @keyframes wave1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-100px); }
        }
        @keyframes wave2 {
          0%, 100% { transform: translateX(-50px); }
          50% { transform: translateX(50px); }
        }
        .wave-effect {
          animation: ripple 6s ease-in-out infinite;
        }
        @keyframes ripple {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </Card>
  );
}

export default ShoppingOrders; 