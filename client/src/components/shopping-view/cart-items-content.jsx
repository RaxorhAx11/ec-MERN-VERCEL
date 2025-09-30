

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        
        if (getCurrentProductIndex !== -1) {
          const getTotalStock = productList[getCurrentProductIndex].totalStock;

          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getTotalStock} quantity available for this item`,
                variant: "destructive",
                className: "bg-[#475569] text-white border-none font-poppins text-sm",
              });
              return;
            }
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        toast({
          title: "Failed to update cart item",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error updating cart item",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item deleted successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        toast({
          title: "Failed to delete cart item",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error deleting cart item",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold text-muted-foreground">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold text-foreground">
          ₹
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 text-muted-foreground hover:text-destructive"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;