import React, { useState } from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag, FiSearch } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { BsGraphUp } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

const DashboardSideBar = ({ openSidebar }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    const menuItems = [
        { id: 1, title: "Dashboard", icon: <RxDashboard size={22} />, path: "/dashboard" },
        { id: 2, title: "All Products", icon: <FiShoppingBag size={22} />, path: "/dashboard-products" },
        { id: 3, title: "Create Product", icon: <AiOutlineFolderAdd size={22} />, path: "/dashboard-create-product" },
        { id: 4, title: "All Orders", icon: <FiPackage size={22} />, path: "/dashboard-orders" },
        { id: 5, title: "Recent Orders", icon: <AiOutlineClockCircle size={22} />, path: "/dashboard-recent-orders" },
        { id: 6, title: "All Events", icon: <MdOutlineLocalOffer size={22} />, path: "/dashboard-events" },
        { id: 7, title: "All Coupons", icon: <AiOutlineGift size={22} />, path: "/dashboard-coupouns" },
        { id: 8, title: "Refunds", icon: <HiOutlineReceiptRefund size={22} />, path: "/dashboard-refunds" },
        { id: 9, title: "Messages", icon: <BiMessageSquareDetail size={22} />, path: "/dashboard-messages" },
        { id: 10, title: "Withdraw", icon: <CiMoneyBill size={22} />, path: "/dashboard-withdraw-money" },
        { id: 11, title: "Settings", icon: <CiSettings size={22} />, path: "/settings" },
    ];

    const filteredMenuItems = menuItems.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className={`${openSidebar ? 'block' : 'hidden'} md:block w-full h-screen bg-white shadow-xl sidebar-shadow overflow-y-scroll hide-scrollbar sticky top-0 left-0 z-10`}>
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
            </div>
            <div className="p-4">
                {filteredMenuItems.map((item) => (
                    <div key={item.id} className="w-full flex items-center p-4 hover:bg-blue-50 rounded-lg transition-all duration-300 group">
                        <Link to={item.path} className="w-full flex items-center">
                            <div className={`p-2 rounded-lg ${isActive(item.path) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100'}`}>
                                {item.icon}
                            </div>
                            <h5
                                className={`pl-4 text-[16px] font-medium ${
                                    isActive(item.path) ? "text-blue-500 font-semibold" : "text-gray-600 group-hover:text-blue-500"
                                }`}
                            >
                                {item.title}
                            </h5>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSideBar;