import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins p-6">
      <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-[#6793AC]/20 animate-zoom-in">
        <CardHeader className="p-0 flex flex-col items-center">
          <XCircle className="w-8 h-8 text-[#475569] mb-3" />
          <CardTitle className="text-2xl font-bold text-[#114AB1] text-center">
            Payment Cancelled
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Your PayPal payment was cancelled. You can try again or continue shopping.
          </p>
        </CardHeader>
        <div className="mt-6 space-y-3">
          <Button
            onClick={() => navigate("/shop/checkout")}
            className="w-full bg-[#475569] hover:bg-[#475569]/90 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </Button>
          <Button
            onClick={() => navigate("/shop/home")}
            variant="outline"
            className="w-full border-[#6793AC] text-[#114AB1] hover:bg-[#6793AC]/10 font-medium py-2 rounded-lg transition-all duration-300"
          >
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PaypalCancelPage;
