import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: null },
  { id: "women", label: "Women", icon: null },
  { id: "kids", label: "Kids", icon: null },
  { id: "accessories", label: "Accessories", icon: null },
  { id: "footwear", label: "Footwear", icon: null },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: null },
  { id: "adidas", label: "Adidas", icon: null },
  { id: "puma", label: "Puma", icon: null },
  { id: "levi", label: "Levi's", icon: null },
  { id: "zara", label: "Zara", icon: null },
  { id: "h&m", label: "H&M", icon: null },
];


const bannerImages = [bannerOne, bannerTwo, bannerThree];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [imageError, setImageError] = useState(false); 
  const brandsScrollRef = useRef(null);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 3000); // 3-second interval
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  function scrollBrands(direction) {
    const container = brandsScrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full h-[500px] overflow-hidden bg-foreground">
        {/* Image Slider */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-600 text-lg">Failed to load banner image</span>
            </div>
          ) : (
            <img
              src={bannerImages[currentSlide]}
              alt={`Banner ${currentSlide + 1}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Center Content removed as requested */}

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full transition-colors duration-200"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full transition-colors duration-200"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </section>

      {/* Category Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem, idx) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="group bg-card border border-border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {categoryItem.icon && (
                    <categoryItem.icon className="w-8 h-8 text-muted-foreground mb-3 group-hover:text-foreground transition-colors duration-200" />
                  )}
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-16 px-6 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Popular Brands
          </h2>
          <div className="relative">
            <div className="hidden lg:flex justify-end gap-2 mb-4">
              <Button variant="outline" size="icon" onClick={() => scrollBrands("left")}> 
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => scrollBrands("right")}>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
            <div
              ref={brandsScrollRef}
              className="flex lg:grid lg:grid-cols-6 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth pb-2"
            >
              {brandsWithIcon.map((brandItem, idx) => (
                <Card
                  key={brandItem.id}
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="group bg-card border border-border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 min-w-[140px] snap-center animate-in fade-in-0 slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {brandItem.icon && (
                      <brandItem.icon className="w-8 h-8 text-muted-foreground mb-3 group-hover:text-foreground transition-colors duration-200" />
                    )}
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {brandItem.label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem, idx) => (
                  <div key={productItem.id} className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: `${idx * 70}ms` }}>
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        className="animate-zoom-in"
      />
    </div>
  );
}

export default ShoppingHome;