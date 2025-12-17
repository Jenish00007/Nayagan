import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

const Header = ({ activeHeading }) => {
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { allProducts } = useSelector((state) => state.products);
  const { appName, logo } = useSelector((state) => state.appSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/categories`);
      setCategories(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term) {
      setSearchData(null);
      return;
    }

    // Filter products
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* Top Header - Desktop */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
        <div className={`${styles.section}`}>
          <div className="hidden lg:h-[80px] lg:flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src={logo}
                    alt={appName}
                    className="w-[140px] h-[100px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Enhanced Search Box */}
            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[50px] w-full pl-4 pr-12 border-2 border-gray-200 rounded-full text-gray-700 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:shadow-md"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <AiOutlineSearch size={24} className="text-white" />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchData && searchData.length !== 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {searchData.map((item, index) => (
                      <Link 
                        key={index}
                        to={`/product/${item._id}`}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        onClick={() => setSearchData(null)}
                      >
                        <img
                          src={item.images?.[0] ? `${item.images[0]}` : "https://via.placeholder.com/150?text=Product"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3 border border-gray-200"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{item.discountPrice || item.originalPrice}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Actions - Desktop */}
            <div className="flex items-center space-x-6">
              {/* Wishlist */}
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenWishlist(true)}
              >
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <AiOutlineHeart size={28} className="text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
                  {wishlist && wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Cart */}
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenCart(true)}
              >
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <AiOutlineShoppingCart size={28} className="text-gray-600 group-hover:text-blue-500 transition-colors duration-300" />
                  {cart && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </div>
              </div>

              {/* User Profile */}
              <div className="relative">
                {isAuthenticated ? (
                  <Link to="/profile" className="group">
                    <img
                      src={user.avatar ? `${backend_url}/${user.avatar}` : "https://avatar.iran.liara.run/public"}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 object-cover"
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://avatar.iran.liara.run/public";
                      }}
                    />
                  </Link>
                ) : (
                  <Link to="/login" className="group">
                    <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                      <CgProfile size={28} className="text-gray-600 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`${
          active ? "shadow-lg fixed top-0 left-0 z-50 backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-700" : "bg-gradient-to-r from-blue-600 to-purple-700"
        } transition-all duration-300 hidden lg:flex items-center justify-between w-full h-[70px]`}
      >
        <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
          {/* Categories Dropdown */}
          <div className="relative">
            <div 
              className="relative h-[50px] w-[280px] cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            >
              <div className="h-full w-full flex items-center justify-between pl-4 pr-4 bg-white/10 backdrop-blur-sm text-white font-medium text-base rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="flex items-center">
                  <BiMenuAltLeft size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span>All Categories</span>
                </div>
                <IoIosArrowDown
                  size={18}
                  className={`transition-transform duration-300 ${dropDown ? 'rotate-180' : ''}`}
                />
              </div>
              {dropDown && (
                <DropDown
                  categoriesData={categories.map(category => ({
                    id: category._id,
                    title: category.name,
                    image_Url: category.image || "https://via.placeholder.com/150?text=Category"
                  }))}
                  setDropDown={setDropDown}
                />
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex justify-center">
            <Navbar active={activeHeading} />
          </div>


        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active ? "shadow-lg fixed top-0 left-0 z-50 bg-white" : "bg-white"
        } w-full h-[70px] lg:hidden border-b border-gray-200`}
      >
        <div className="w-full flex items-center justify-between px-4 h-full">
          {/* Mobile Menu Button */}
          <div
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <BiMenuAltLeft size={28} className="text-gray-700" />
          </div>

          {/* Mobile Logo */}
          <div className="flex items-center flex-1 justify-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt={appName}
                className="w-[80px] h-[100px] object-contain"
              />
            </Link>
          </div>

          {/* Mobile Cart */}
          <div
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            onClick={() => setOpenCart(true)}
          >
            <AiOutlineShoppingCart size={26} className="text-gray-700" />
            {cart && cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed w-full bg-black/50 z-50 h-full top-0 left-0 lg:hidden">
          <div className="fixed w-[85%] bg-white h-screen top-0 left-0 z-50 overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  setOpenWishlist(true);
                  setOpen(false);
                }}
              >
                <AiOutlineHeart size={26} className="text-gray-700" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </div>

              <div
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <RxCross1 size={24} className="text-gray-700" />
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="h-[45px] w-full pl-4 pr-12 border-2 border-gray-200 rounded-full text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                  <AiOutlineSearch size={20} className="text-white" />
                </div>

                {searchData && searchData.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      {searchData.map((item, index) => (
                        <Link
                          key={index}
                          to={`/product/${item._id}`}
                          className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          onClick={() => {
                            setSearchData(null);
                            setOpen(false);
                          }}
                        >
                          <img
                            src={item.images && item.images[0] ? `${backend_url}/${item.images[0]}` : "https://via.placeholder.com/150?text=Product"}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-200"
                          />
                          <h5 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="p-4">
              <Navbar active={activeHeading} />
            </div>

            {/* Mobile User Section */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <div className="flex items-center justify-center space-x-6">
                {isAuthenticated ? (
                  <Link 
                    to="/profile" 
                    className="flex flex-col items-center space-y-2"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={`${backend_url}${user.avatar}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-4 border-blue-200"
                    />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </Link>
                ) : (
                  <div className="flex space-x-6">
                    <Link
                      to="/login"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/sign-up"
                      className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                      onClick={() => setOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;