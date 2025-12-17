import React, { useState } from "react";
import { AiOutlineGift, AiOutlineBell } from "react-icons/ai";
import { MdOutlineLocalOffer, MdOutlineDashboard } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardHeader = ({ setOpenSidebar, openSidebar }) => {
    const { seller } = useSelector((state) => state.seller);
    const { appName, logo } = useSelector((state) => state.appSettings);
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: "/dashboard", icon: <MdOutlineDashboard size={24} />, label: "Dashboard" },
        { path: "/dashboard-coupouns", icon: <AiOutlineGift size={24} />, label: "Coupons" },
        { path: "/dashboard-events", icon: <MdOutlineLocalOffer size={24} />, label: "Events" },
        { path: "/dashboard-products", icon: <FiShoppingBag size={24} />, label: "Products" },
        { path: "/dashboard-orders", icon: <FiPackage size={24} />, label: "Orders" },
        { path: "/dashboard-messages", icon: <BiMessageSquareDetail size={24} />, label: "Messages" },
    ];
    
    return (
        <div className="w-full h-[80px] bg-white shadow-lg sticky top-0 left-0 z-30">
            <div className="w-full h-full px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <RxHamburgerMenu
                        size={30}
                        className="cursor-pointer md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setOpenSidebar(!openSidebar)}
                    />
                    <Link to="/dashboard" className="flex items-center group">
                        <div className="relative">
                            <img
                                src={logo}
                                alt={appName}
                                className="w-[140px] h-[100px] object-contain transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                                    isActive(item.path)
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                        : "text-gray-600 hover:bg-blue-50"
                                }`}
                            >
                                {item.icon}
                            
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <Link to="/settings">
                            <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                                <FiSettings
                                    color="#555"
                                    size={24}
                                    className="cursor-pointer hover:text-blue-600 transition-colors duration-300"
                                />
                            </div>
                        </Link>
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <AiOutlineBell
                                color="#555"
                                size={24}
                                className="cursor-pointer hover:text-blue-600 transition-colors duration-300"
                            />
                        </div>
                        <Link to={`/shop/${seller._id}`}>
                            <div className="relative group">
                                <img
                                    src={seller?.avatar || "https://avatar.iran.liara.run/public/boy"}
                                    alt=""
                                    className="w-[45px] h-[45px] rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://avatar.iran.liara.run/public/boy";
                                    }}
                                />
                                <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;