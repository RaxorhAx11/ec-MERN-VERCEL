import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="admin-layout flex min-h-screen w-full">
      {/* Modern Admin Sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Modern Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        
        {/* Main Content with Modern Styling */}
        <main className="flex-1 bg-slate-50/30 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
