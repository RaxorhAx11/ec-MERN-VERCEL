import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, createMockOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateMockPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "mock",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createMockOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        toast({
          title: "Mock payment initiated successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        setIsPaymemntStart(false);
        toast({
          title: "Failed to initiate mock payment",
          description: data?.payload?.message || "Failed to create order",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      setIsPaymemntStart(false);
      toast({
        title: "Error initiating mock payment",
        description: "An error occurred while creating the order",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  function handleInitiatePaypalPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        toast({
          title: "Payment initiated successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        setIsPaymemntStart(false);
        toast({
          title: "Failed to initiate payment",
          description: data?.payload?.message || "Failed to create order",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      setIsPaymemntStart(false);
      toast({
        title: "Error initiating payment",
        description: "An error occurred while creating the order",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-poppins">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
          alt="Checkout Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#6793AC]/30"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 p-5 container mx-auto">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          className="bg-white p-5 rounded-xl shadow-md border border-[#6793AC]/20 animate-slide-in-left"
        />
        <div className="flex flex-col gap-5 bg-white p-5 rounded-xl shadow-md border border-[#6793AC]/20 animate-slide-in-right">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, idx) => (
                <UserCartItemsContent
                  key={item.productId}
                  cartItem={item}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                />
              ))
            : null}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-base text-[#114AB1]">Total</span>
              <span className="font-bold text-base text-[#475569]">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Button
              onClick={handleInitiateMockPayment}
              className={`w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                isPaymentStart ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPaymentStart}
            >
              {isPaymentStart ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Processing...
                </>
              ) : (
                "Test with Mock Payment"
              )}
            </Button>
            <Button
              onClick={handleInitiatePaypalPayment}
              className={`w-full bg-[#475569] hover:bg-[#475569]/90 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                isPaymentStart ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPaymentStart}
            >
              {isPaymentStart ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Processing...
                </>
              ) : (
                "Checkout with PayPal"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;