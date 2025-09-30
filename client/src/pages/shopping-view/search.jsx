import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
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
            className: "bg-[#475569] text-white border-none font-poppins",
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
          title: "Product added to cart!",
          className: "bg-[#6793AC] text-white border-none font-poppins",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen bg-gray-100 font-poppins">
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#114AB1]" />
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="pl-10 py-5 rounded-lg border-[#6793AC]/30 focus:ring-[#114AB1] focus:border-[#114AB1] transition-all duration-300 bg-white shadow-md text-sm"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-3xl font-bold text-[#114AB1] text-center animate-fade-in">
          No Results Found!
        </h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item, idx) => (
          <ShoppingProductTile
            key={item.id}
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
            className="animate-slide-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        className="animate-zoom-in"
      />
    </div>
  );
}

export default SearchProducts;