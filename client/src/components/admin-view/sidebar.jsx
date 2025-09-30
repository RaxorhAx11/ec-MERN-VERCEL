import {
  BadgeCheck,
  BarChart3,
  LayoutDashboard,
  Package,
  X,
  MessageSquare,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Overview and analytics",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <Package className="w-5 h-5" />,
    description: "Manage inventory",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="w-5 h-5" />,
    description: "Order management",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Business insights",
  },
  {
    id: "support",
    label: "Support",
    path: "/admin/support",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Help and support",
  },
];

function MenuItems({ setOpen, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 mt-8">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <button
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`admin-sidebar-item ${
              isActive ? "active" : ""
            } ${isMobile ? "mx-2" : ""} group`}
          >
            <div className="flex items-center gap-3">
              {menuItem.icon}
              <div className="flex flex-col items-start">
                <span className="font-medium">{menuItem.label}</span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {menuItem.description}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 p-0 admin-sidebar">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 py-4 border-b border-admin-sidebar-border">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-xs text-muted-foreground">Management Dashboard</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </SheetHeader>
            <div className="flex-1 px-4 py-6">
              <MenuItems setOpen={setOpen} isMobile={true} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col admin-sidebar">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-admin-sidebar-border">
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="flex cursor-pointer items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <MenuItems />
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-admin-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>Admin Panel</p>
              <p className="mt-1">@RaxorhAx</p>
            </div>
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
