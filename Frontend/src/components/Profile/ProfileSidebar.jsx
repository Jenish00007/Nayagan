import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        
        localStorage.clear();
        navigate("/login");
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-4 pt-8 flex flex-col gap-2">
      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 1 ? 'bg-gradient-to-r from-blue-50 to-blue-100 shadow text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(1)}
      >
        <RxPerson size={22} color={active === 1 ? "#2563eb" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Profile</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 2 ? 'bg-gradient-to-r from-green-50 to-green-100 shadow text-green-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={22} color={active === 2 ? "#059669" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Orders</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 3 ? 'bg-gradient-to-r from-pink-50 to-pink-100 shadow text-pink-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={22} color={active === 3 ? "#db2777" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Refunds</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 4 ? 'bg-gradient-to-r from-purple-50 to-purple-100 shadow text-purple-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage size={22} color={active === 4 ? "#7c3aed" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Inbox</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 5 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 shadow text-yellow-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={22} color={active === 5 ? "#eab308" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Track Order</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 6 ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 shadow text-indigo-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={22} color={active === 6 ? "#6366f1" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Change Password</span>
      </div>

      <div
        className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${active === 7 ? 'bg-gradient-to-r from-teal-50 to-teal-100 shadow text-teal-700 font-semibold' : 'hover:bg-gray-50'}`}
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={22} color={active === 7 ? "#14b8a6" : "#555"} />
        <span className={`pl-3 800px:block hidden`}>Address</span>
      </div>

      {user && user?.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className={`flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 shadow text-white font-semibold`}
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings size={22} color={"#fff"} />
            <span className="pl-3 800px:block hidden">Admin Dashboard</span>
          </div>
        </Link>
      )}

      <div
        className="flex items-center cursor-pointer w-full px-4 py-3 rounded-lg transition-all duration-200 mb-1 hover:bg-red-50"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={22} color="#d02222" />
        <span className="pl-3 text-[#d02222] 800px:block hidden">Logout</span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
