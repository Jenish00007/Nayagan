import React, { useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllCategories from "../components/Admin/AllCategories";

const AdminDashboardCategories = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div>
      <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          {/* Sidebar: overlay on mobile, static on md+ */}
          {/* Mobile overlay */}
          {openSidebar && (
            <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={() => setOpenSidebar(false)}>
              <div className="w-[250px] bg-white h-full shadow-xl sidebar-shadow relative" onClick={e => e.stopPropagation()}>
                {/* Optional: Add a close button here */}
                <AdminSideBar active={10} openSidebar={openSidebar} />
              </div>
            </div>
          )}
          {/* Static sidebar on md+ */}
          <div className="hidden md:block w-[80px] 800px:w-[330px]">
            <AdminSideBar active={10} openSidebar={openSidebar} />
          </div>
          {/* Main content: always full width */}
          <div className="w-full">
            <AllCategories />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCategories; 