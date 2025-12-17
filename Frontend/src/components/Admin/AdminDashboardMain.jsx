import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShoppingCart, AiOutlineLineChart, AiOutlineEye, AiOutlineClose, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from "react-icons/ai";
import { MdOutlineStorefront, MdOutlineTrendingUp, MdOutlinePeopleAlt } from "react-icons/md";
import { BsGraphUpArrow, BsCurrencyRupee, BsFilter } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { FiSearch } from "react-icons/fi";
import AdminSideBar from "./Layout/AdminSideBar";
import OrderPreviewModal from "./OrderPreviewModal";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestOrderSearch, setLatestOrderSearch] = useState("");
  const [selectedOrderDate, setSelectedOrderDate] = useState("");
  const [selectedOrderDateISO, setSelectedOrderDateISO] = useState("");

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

  // Calculate total items count from all orders
  const totalItemsCount = adminOrders?.reduce((acc, order) => {
    return acc + order?.cart?.reduce((cartAcc, item) => cartAcc + item.qty, 0);
  }, 0) || 0;
   // Calculate total products count from all sellers
   const totalProductsCount = sellers?.reduce((acc, seller) => {
    return acc + (seller?.products?.length || 0);
  }, 0) || 0;


  // Get unique customers count
  const uniqueCustomers = adminOrders ? new Set(adminOrders.map(order => order.user?._id)).size : 0;

  // Get unique order dates from the latest orders (as displayed)
  const uniqueOrderDates = Array.from(new Set((adminOrders || []).map(order => order.createdAt)));

  // Function to format currency in Indian format
  const formatIndianCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  // Helper to format a Date object to '7 Jun 2025'
  const formatDisplayDate = (dateObj) => {
    return dateObj
      ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';
  };

  const columns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 180, 
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-4 w-full group">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex-shrink-0 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm">
            <AiOutlineShoppingCart className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight group-hover:text-blue-600 transition-colors duration-200">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-1">Order ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-4 w-full group">
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex-shrink-0 group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-300 shadow-sm">
            <MdOutlinePeopleAlt className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight group-hover:text-indigo-600 transition-colors duration-200">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-1">Customer</span>
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 160,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: (params) => {
        const status = params.getValue(params.id, "status");
        return `custom-cell status-${status.toLowerCase()}`;
      },
      renderCell: (params) => {
        const status = params.getValue(params.id, "status");
        const statusConfig = {
          Delivered: {
            bg: "bg-gradient-to-r from-green-100 to-emerald-100",
            text: "text-green-800",
            icon: "✓",
            label: "Delivered",
            shadow: "shadow-green-100"
          },
          Processing: {
            bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
            text: "text-yellow-800",
            icon: "⟳",
            label: "Processing",
            shadow: "shadow-yellow-100"
          },
          Pending: {
            bg: "bg-gradient-to-r from-blue-100 to-sky-100",
            text: "text-blue-800",
            icon: "⏳",
            label: "Pending",
            shadow: "shadow-blue-100"
          },
          Cancelled: {
            bg: "bg-gradient-to-r from-red-100 to-rose-100",
            text: "text-red-800",
            icon: "✕",
            label: "Cancelled",
            shadow: "shadow-red-100"
          }
        };
        const config = statusConfig[status] || statusConfig.Processing;
        return (
          <div className="flex items-center justify-center w-full">
            <div className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${config.bg} ${config.text} ${config.shadow} flex items-center gap-2.5 min-w-[130px] justify-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105`}>
              <span className="text-base animate-pulse">{config.icon}</span>
              {config.label}
            </div>
          </div>
        );
      },
    },
    {
      field: "total",
      headerName: "Total Amount",
      type: "number",
      minWidth: 180,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-4 w-full group">
          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex-shrink-0 group-hover:from-green-100 group-hover:to-emerald-200 transition-all duration-300 shadow-sm">
            <BsCurrencyRupee className="text-green-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight group-hover:text-green-600 transition-colors duration-200">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-1">Amount Paid</span>
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 180,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-4 w-full group">
          <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl flex-shrink-0 group-hover:from-gray-100 group-hover:to-slate-200 transition-all duration-300 shadow-sm">
            <MdOutlineTrendingUp className="text-gray-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight group-hover:text-gray-700 transition-colors duration-200">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-1">Order Date</span>
          </div>
        </div>
      ),
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        customerName: item?.user?.name || "N/A",
        total: formatIndianCurrency(item?.totalPrice),
        status: item?.status,
        createdAt: new Date(item?.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      });
    });

  const orderStatusSummary = [
    {
      key: "unassigned",
      label: "Unassigned Orders",
      icon: "📅",
      count: adminOrders?.filter(order => order.status === "Unassigned").length || 0,
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      hoverGradient: "hover:from-blue-100 hover:to-blue-200"
    },
    {
      key: "accepted",
      label: "Accepted By Delivery Man",
      icon: "🧑‍✈️",
      count: adminOrders?.filter(order => order.status === "Accepted").length || 0,
      color: "text-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      hoverGradient: "hover:from-teal-100 hover:to-teal-200"
    },
    {
      key: "packaging",
      label: "Packaging",
      icon: "📦",
      count: adminOrders?.filter(order => order.status === "Packaging").length || 0,
      color: "text-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      hoverGradient: "hover:from-orange-100 hover:to-orange-200"
    },
    {
      key: "outForDelivery",
      label: "Out For Delivery",
      icon: "🚚",
      count: adminOrders?.filter(order => order.status === "Out For Delivery").length || 0,
      color: "text-green-600",
      bgGradient: "from-green-50 to-green-100",
      hoverGradient: "hover:from-green-100 hover:to-green-200"
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: "✅",
      count: adminOrders?.filter(order => order.status === "Delivered").length || 0,
      color: "text-green-700",
      bgGradient: "from-emerald-50 to-emerald-100",
      hoverGradient: "hover:from-emerald-100 hover:to-emerald-200"
    },
    {
      key: "canceled",
      label: "Canceled",
      icon: "❌",
      count: adminOrders?.filter(order => order.status === "Canceled").length || 0,
      color: "text-red-600",
      bgGradient: "from-red-50 to-red-100",
      hoverGradient: "hover:from-red-100 hover:to-red-200"
    },
    {
      key: "refunded",
      label: "Refunded",
      icon: "💸",
      count: adminOrders?.filter(order => order.status === "Refunded").length || 0,
      color: "text-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
      hoverGradient: "hover:from-pink-100 hover:to-pink-200"
    },
    {
      key: "paymentFailed",
      label: "Payment Failed",
      icon: "💳",
      count: adminOrders?.filter(order => order.status === "Payment Failed").length || 0,
      color: "text-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100",
      hoverGradient: "hover:from-yellow-100 hover:to-yellow-200"
    }
  ];

  // Filter latest orders by order ID and selected date (formatted as '7 Jun 2025')
  const filteredLatestOrders = row.filter(orderRow => {
    const matchesOrderId = ("#" + orderRow.id.slice(-6)).toLowerCase().includes(latestOrderSearch.toLowerCase());
    let matchesDate = true;
    if (selectedOrderDateISO) {
      const pickedDate = new Date(selectedOrderDateISO);
      const formattedPickedDate = formatDisplayDate(pickedDate);
      matchesDate = orderRow.createdAt === formattedPickedDate;
    }
    return matchesOrderId && matchesDate;
  });

  const handlePreview = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
          {/* Header Section with Enhanced Styling */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <span className="text-4xl">🛠️</span>
                </div>
                <div>
                  <div className="font-bold text-[32px] font-Poppins bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Admin Dashboard
                  </div>
                  <div className="text-gray-600 text-[18px] mt-1 font-medium">
                    Manage your admin tasks with powerful insights
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
            </div>
            <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-sm text-gray-500 font-medium">Current Date</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-blue-100/50">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <span className="text-4xl">🛒</span>
              </div>
              <span className="text-base font-semibold text-gray-600 mb-2">Items</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">{totalItemsCount}</span>
              <span className="text-sm text-gray-400">Total Items Sold</span>
            </div>

            <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-purple-100/50">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <span className="text-4xl">🛍️</span>
              </div>
              <span className="text-base font-semibold text-gray-600 mb-2">Orders</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                {adminOrders && adminOrders.length}
              </span>
              <span className="text-sm text-gray-400">Total Orders</span>
            </div>

            <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-green-100/50">
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                <span className="text-4xl">🏪</span>
              </div>
              <span className="text-base font-semibold text-gray-600 mb-2">Grocery Stores</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                {sellers && sellers.length}
              </span>
              <span className="text-sm text-gray-400">Total Stores</span>
            </div>

            <div className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-orange-100/50">
              <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <span className="text-4xl">👥</span>
              </div>
              <span className="text-base font-semibold text-gray-600 mb-2">Customers</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">{uniqueCustomers}</span>
              <span className="text-sm text-gray-400">Total Customers</span>
            </div>

            <div className="group bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-emerald-100/50">
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mb-4 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                <span className="text-4xl">💰</span>
              </div>
              <span className="text-base font-semibold text-gray-600 mb-2">Total Earnings</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
                {formatIndianCurrency(adminBalance)}
              </span>
              <span className="text-sm text-gray-400">0 Newly added</span>
            </div>
          </div>

          {/* Order Status Summary Cards - Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {orderStatusSummary.map(status => (
              <div
                key={status.key}
                className={`flex items-center gap-3 bg-white rounded-lg shadow p-4 transition-transform hover:scale-105 border-l-4 w-full
                  ${
                    status.key === "unassigned" ? "border-blue-400" :
                    status.key === "accepted" ? "border-teal-400" :
                    status.key === "packaging" ? "border-orange-400" :
                    status.key === "outForDelivery" ? "border-green-400" :
                    status.key === "delivered" ? "border-green-600" :
                    status.key === "canceled" ? "border-red-400" :
                    status.key === "refunded" ? "border-pink-400" :
                    status.key === "paymentFailed" ? "border-yellow-400" : "border-gray-200"
                  }`}
                style={{ minHeight: 70 }}
              >
                <div className={`rounded-full p-2 text-xl bg-gray-100 ${status.color}`}>
                  {status.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">{status.label}</span>
                  <span className={`text-lg font-bold ${status.color}`}>{status.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Orders Table */}
          <div className="mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                    <AiOutlineLineChart className="text-white" size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                </div>
                <div>
                  <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                    Latest Orders
                  </div>
                  <div className="text-gray-600 text-lg mt-2 font-medium">
                    Track and manage customer orders
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {adminOrders?.length || 0} total orders
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-end mr-12">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search by Order ID (e.g. #643d89)..."
                    className="w-full sm:w-[300px] pl-12 pr-6 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
                    value={latestOrderSearch}
                    onChange={e => setLatestOrderSearch(e.target.value)}
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl border-2 border-blue-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-200 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg datepicker-left"
                    value={selectedOrderDateISO}
                    onChange={e => setSelectedOrderDateISO(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLatestOrders.slice(0, 5).map((orderRow) => {
                      // Find the full order object from adminOrders
                      const fullOrder = adminOrders.find(o => o._id === orderRow.id);
                      return (
                        <tr key={orderRow.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl flex-shrink-0 shadow-sm">
                                <AiOutlineShoppingCart className="text-gray-600" size={20} />
                              </div>
                              <span className="font-medium text-gray-800">#{orderRow.id.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-indigo-100 rounded-xl flex-shrink-0 shadow-sm">
                                <MdOutlinePeopleAlt className="text-indigo-600" size={20} />
                              </div>
                              <span className="font-medium text-gray-800">{orderRow.customerName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                              orderRow.status === "Delivered" 
                                ? "bg-green-100 text-green-800" 
                                : orderRow.status === "Processing" 
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {orderRow.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl flex-shrink-0 shadow-sm">
                                <BsCurrencyRupee className="text-gray-600" size={20} />
                              </div>
                              <span className="font-medium text-gray-800">{orderRow.total}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl flex-shrink-0 shadow-sm">
                                <MdOutlineTrendingUp className="text-gray-600" size={20} />
                              </div>
                              <span className="font-medium text-gray-800">{orderRow.createdAt}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handlePreview(fullOrder)}
                              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                              title="View Order Details"
                            >
                              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Preview Modal */}
      <OrderPreviewModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </>
  );
};

export default AdminDashboardMain;