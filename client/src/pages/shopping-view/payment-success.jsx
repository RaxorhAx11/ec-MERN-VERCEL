import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins p-6">
      <Card className="p-8 max-w-md w-full bg-white shadow-md rounded-xl border border-[#6793AC]/20 animate-zoom-in">
        <CardHeader className="p-0 flex flex-col items-center">
          <CheckCircle2 className="w-8 h-8 text-[#475569] mb-3 animate-bounce" />
          <CardTitle className="text-2xl font-bold text-[#114AB1] text-center">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <div className="mt-6">
          <Button
            onClick={() => navigate("/shop/account")}
            className="w-full bg-[#475569] hover:bg-[#475569]/90 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            View Orders
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;