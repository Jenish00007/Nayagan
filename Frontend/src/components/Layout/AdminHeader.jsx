import React from "react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiMoneyBill } from "react-icons/ci";
import { GrWorkshop } from "react-icons/gr";
import { backend_url } from "../../server";
import { RxHamburgerMenu } from "react-icons/rx";

const AdminHeader = ({ setOpenSidebar, openSidebar }) => {
  const { user } = useSelector((state) => state.user);
  const { appName, logo } = useSelector((state) => state.appSettings);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div className="flex items-center">
        <RxHamburgerMenu 
          size={30} 
          className="mr-4 cursor-pointer md:hidden"
          onClick={() => setOpenSidebar(!openSidebar)}
        />
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <img
              src={logo}
              alt={appName}
              className="w-[140px] h-[100px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* <h1 className="text-2xl font-bold ml-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {appName}
          </h1> */}
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/admin-withdraw-request" className="800px:block hidden">
            <CiMoneyBill
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/admin-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/admin-sellers" className="800px:block hidden">
            <GrWorkshop
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <img
            src={user?.avatar || "https://avatar.iran.liara.run/public/boy"}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://avatar.iran.liara.run/public/boy";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
