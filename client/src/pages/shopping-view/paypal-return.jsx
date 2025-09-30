import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      if (!orderId) {
        console.error("No order ID found in session storage");
        window.location.href = "/shop/checkout";
        return;
      }
      
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        } else {
          console.error("Payment capture failed:", data?.payload?.message);
          window.location.href = "/shop/checkout";
        }
      }).catch((error) => {
        console.error("Payment capture error:", error);
        window.location.href = "/shop/checkout";
      });
    } else {
      console.error("Missing payment parameters");
      window.location.href = "/shop/checkout";
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins p-6">
      <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-[#6793AC]/20 animate-pulse">
        <CardHeader className="p-0 flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-[#114AB1] animate-spin mb-3" />
          <CardTitle className="text-xl font-bold text-[#114AB1] text-center">
            Processing Payment...
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">Please wait a moment!</p>
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;