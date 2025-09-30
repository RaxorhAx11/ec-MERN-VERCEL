import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-3">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative border-border hover:bg-accent rounded-md transition-colors duration-200"
        >
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-foreground hover:opacity-90 transition-opacity duration-200">
            <AvatarFallback className="bg-foreground text-background font-medium text-sm">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 bg-popover text-popover-foreground shadow-lg rounded-lg border border-border">
          <DropdownMenuLabel className="font-medium text-sm">
            Logged in as {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.png" 
            alt="WalkUp Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-bold text-xl text-foreground">
            <span>Walk</span>
            <span className="text-primary">Up</span>
          </span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-border hover:bg-accent rounded-md"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-background border-border">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;