import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();
  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log("Filter clicked:", getSectionId, getCurrentOption);
    console.log("Current filters:", filters);
    
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    
    if (indexOfCurrentSection === -1) {
      // Section doesn't exist, create it with the current option
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      // Section exists, toggle the option
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        // Option not in array, add it
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        // Option exists, remove it
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        
        // If section is now empty, remove it from filters
        if (cpyFilters[getSectionId].length === 0) {
          delete cpyFilters[getSectionId];
        }
      }
    }
    
    console.log("New filters:", cpyFilters);
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    } else if (filters && Object.keys(filters).length === 0) {
      // Clear search params when no filters are applied
      setSearchParams(new URLSearchParams());
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 p-5 bg-gray-100 min-h-screen font-poppins">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        className="bg-white p-5 rounded-xl shadow-md border border-[#6793AC]/20 animate-slide-in-left"
      />
      <div className="bg-white rounded-xl shadow-md border border-[#6793AC]/20 overflow-hidden">
        <div className="p-5 border-b border-[#6793AC]/20 flex items-center justify-between bg-gradient-to-r from-[#6793AC]/10 to-white">
          <h2 className="text-xl font-bold text-[#114AB1]">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium text-sm">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-[#6793AC]/30 hover:bg-[#6793AC]/10 transition-all duration-300 rounded-lg"
                >
                  <ArrowUpDownIcon className="h-4 w-4 text-[#114AB1]" />
                  <span className="text-[#114AB1] font-medium text-sm">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white shadow-md rounded-lg border border-[#6793AC]/20">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="px-4 py-2 text-[#114AB1] font-medium text-sm hover:bg-[#6793AC]/10 transition-all duration-200"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
          {productList && productList.length > 0
            ? productList.map((productItem, idx) => (
                <ShoppingProductTile
                  key={productItem.id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                  className="animate-slide-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                />
              ))
            : null}
        </div>
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

export default ShoppingListing;