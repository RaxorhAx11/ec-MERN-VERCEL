import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
            className: "bg-[#475569] text-white border-none font-poppins text-sm",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!user?.id) {
      toast({
        title: "Please login to write a review",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast({
        title: "Please select a star rating",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
      return;
    }

    if (reviewMsg.trim() === "") {
      toast({
        title: "Please enter your review message",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg.trim(),
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else if (data?.payload?.message) {
        toast({
          title: data.payload.message,
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-8 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-background border-border">
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.3" className="wave-1" />
            <path d="M0,40 C400,20 800,60 1200,20 C1320,0 1440,40 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.2" className="wave-2" />
          </svg>
        </div>
        <div className="relative overflow-hidden rounded-lg z-10">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="z-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-base mt-3 mb-4">{productDetails?.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-xl font-bold text-foreground ${productDetails?.salePrice > 0 ? "line-through text-muted-foreground" : ""}`}
            >
              ₹{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-xl font-bold text-primary">₹{productDetails?.salePrice}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground text-sm">({averageReview.toFixed(2)})</span>
          </div>
          <div className="mt-4 mb-4">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full" variant="secondary" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold text-foreground mb-3">Reviews</h2>
            <div className="grid gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div key={reviewItem._id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-foreground text-sm">{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground text-sm">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-sm">{reviewItem.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-sm text-muted-foreground">No Reviews</h1>
              )}
            </div>
            <div className="mt-8 flex-col flex gap-2">
              <Label className="text-foreground text-sm">Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
                className="text-sm"
              />
              <Button
                type="button"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating < 1}
                className="text-sm"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;  
