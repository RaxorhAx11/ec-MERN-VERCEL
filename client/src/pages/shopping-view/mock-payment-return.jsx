import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureMockPayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function MockPaymentReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      if (!orderId) {
        console.error("No order ID found in session storage");
        setPaymentStatus("error");
        return;
      }
      
      dispatch(captureMockPayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          setPaymentStatus("success");
          setPaymentResult(data.payload);
          sessionStorage.removeItem("currentOrderId");
        } else {
          setPaymentStatus("failed");
          setPaymentResult(data.payload);
        }
      }).catch((error) => {
        console.error("Mock payment capture error:", error);
        setPaymentStatus("error");
      });
    } else {
      console.error("Missing payment parameters");
      setPaymentStatus("error");
    }
  }, [paymentId, payerId, dispatch]);

  const handleContinue = () => {
    if (paymentStatus === "success") {
      window.location.href = "/shop/payment-success";
    } else {
      window.location.href = "/shop/checkout";
    }
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-[#6793AC]/20 animate-pulse">
            <CardHeader className="p-0 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-[#114AB1] animate-spin mb-3" />
              <CardTitle className="text-xl font-bold text-[#114AB1] text-center">
                Processing Mock Payment...
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2">Simulating payment processing...</p>
            </CardHeader>
          </Card>
        );

      case "success":
        return (
          <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-green-200 animate-zoom-in">
            <CardHeader className="p-0 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="text-2xl font-bold text-green-600 text-center">
                Mock Payment Successful!
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Your mock payment has been processed successfully.
              </p>
              {paymentResult?.mockPaymentDetails && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-xs">
                  <p><strong>Payment ID:</strong> {paymentResult.mockPaymentDetails.paymentId}</p>
                  <p><strong>Amount:</strong> ${paymentResult.mockPaymentDetails.amount}</p>
                  <p><strong>Status:</strong> {paymentResult.mockPaymentDetails.status}</p>
                </div>
              )}
            </CardHeader>
            <div className="mt-6">
              <Button
                onClick={handleContinue}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
              >
                Continue to Success Page
              </Button>
            </div>
          </Card>
        );

      case "failed":
        return (
          <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-red-200 animate-zoom-in">
            <CardHeader className="p-0 flex flex-col items-center">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <CardTitle className="text-2xl font-bold text-red-600 text-center">
                Mock Payment Failed
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2 text-center">
                {paymentResult?.message || "The mock payment simulation failed."}
              </p>
              {paymentResult?.mockPaymentDetails && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg text-xs">
                  <p><strong>Payment ID:</strong> {paymentResult.mockPaymentDetails.paymentId}</p>
                  <p><strong>Status:</strong> {paymentResult.mockPaymentDetails.status}</p>
                  <p><strong>Reason:</strong> {paymentResult.mockPaymentDetails.reason}</p>
                </div>
              )}
            </CardHeader>
            <div className="mt-6">
              <Button
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
              >
                Try Again
              </Button>
            </div>
          </Card>
        );

      case "error":
        return (
          <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-red-200 animate-zoom-in">
            <CardHeader className="p-0 flex flex-col items-center">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <CardTitle className="text-2xl font-bold text-red-600 text-center">
                Payment Error
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2 text-center">
                An error occurred while processing the mock payment.
              </p>
            </CardHeader>
            <div className="mt-6">
              <Button
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
              >
                Return to Checkout
              </Button>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins p-6">
      {renderContent()}
    </div>
  );
}

export default MockPaymentReturnPage;
