import React, { useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellers = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div>
      <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          {/* Sidebar: overlay on mobile, static on md+ */}
          {/* Mobile overlay */}
          {openSidebar && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex md:hidden transition-opacity duration-300" onClick={() => setOpenSidebar(false)}>
              <div
                className="w-[85vw] max-w-xs bg-white h-full shadow-2xl sidebar-shadow relative animate-slide-in-left focus:outline-none"
                onClick={e => e.stopPropagation()}
                tabIndex={0}
                aria-modal="true"
                role="dialog"
              >
                {/* Close button */}
                <button
                  aria-label="Close sidebar"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setOpenSidebar(false)}
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <AdminSideBar active={3} openSidebar={openSidebar} />
              </div>
            </div>
          )}
          {/* Static sidebar on md+ */}
          <div className="hidden md:block w-[80px] 800px:w-[330px]">
            <AdminSideBar active={3} openSidebar={openSidebar} />
          </div>
          {/* Main content: always full width */}
          <div className="w-full">
            <AllSellers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSellers;
