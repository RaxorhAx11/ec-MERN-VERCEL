import { 
  AlignJustify, 
  Bell, 
  LogOut, 
  Search, 
  User
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="admin-header sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button 
            onClick={() => setOpen(true)} 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-muted"
          >
            <AlignJustify className="w-5 h-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-80 admin-input"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications - Show real notification count */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted">
            <Bell className="w-5 h-5" />
            {user?.notifications?.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
              >
                {user.notifications.length}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.userName || "Admin"}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="admin-button outline"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
