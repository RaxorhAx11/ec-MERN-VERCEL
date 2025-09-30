import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return (
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center">
          <p className="text-gray-500">No order details available</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border-[#6793AC]/20 shadow-xl rounded-lg font-poppins">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-bold text-[#114AB1] flex items-center gap-2">
          <span>Order Details</span>
          <Badge 
            variant="outline" 
            className={`px-3 py-1 text-xs font-medium ${
              orderDetails?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
              orderDetails?.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              orderDetails?.orderStatus === 'delivered' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {orderDetails?.orderStatus?.toUpperCase()}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Information */}
        <Card className="border-[#6793AC]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#114AB1]">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Order ID:</span>
                  <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {orderDetails?._id?.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Order Date:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(orderDetails?.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                  <span className="text-sm font-semibold text-[#114AB1]">
                    ${orderDetails?.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                  <Badge variant="outline" className="capitalize">
                    {orderDetails?.paymentMethod}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Payment Status:</span>
                  <Badge 
                    variant="outline"
                    className={`capitalize ${
                      orderDetails?.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                      orderDetails?.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {orderDetails?.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Order Status:</span>
                  <Badge 
                    variant="outline"
                    className={`capitalize ${
                      orderDetails?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                      orderDetails?.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      orderDetails?.orderStatus === 'delivered' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {orderDetails?.orderStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="border-[#6793AC]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#114AB1]">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails?.cartItems.map((item, idx) => (
                  <div 
                    key={`${item.productId}-${idx}`} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500">SKU: {item.productId?.substring(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="font-medium text-[#114AB1]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="border-[#6793AC]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#114AB1]">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Recipient:</span>
                    <p className="text-sm text-gray-900 font-medium">{user?.userName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-sm text-gray-900">{orderDetails?.addressInfo?.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-sm text-gray-900">{orderDetails?.addressInfo?.address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">City, Pincode:</span>
                    <p className="text-sm text-gray-900">
                      {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
                    </p>
                  </div>
                </div>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Delivery Notes:</span>
                  <p className="text-sm text-gray-900 mt-1">{orderDetails?.addressInfo?.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;