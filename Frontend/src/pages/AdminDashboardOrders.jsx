import React, { useState, useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { BsCurrencyRupee } from "react-icons/bs";
import Loader from "../components/Layout/Loader";
import OrderPreviewModal from "../components/Admin/OrderPreviewModal";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const handlePreview = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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

  // Filter orders based on search term and date range
  const filteredOrders = (adminOrders || []).filter((order) => {
    const customerName = order.user?.name?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";
    const status = order.status?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = customerName.includes(search) || orderId.includes(search) || status.includes(search);

    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;

    // Only filter by start date, or show all if no start date
    const matchesDate = (!start || orderDate >= start);

    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className={`${openSidebar ? 'w-[250px]' : 'w-[80px]'} 800px:w-[330px]`}>
            <AdminSideBar active={4} openSidebar={openSidebar} />
          </div>
          <div className="w-full">
            {adminOrderLoading ? (
              <Loader />
            ) : (
              <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                        <AiOutlineShoppingCart className="text-white" size={28} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                    </div>
                    <div>
                      <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                        All Orders
                      </div>
                      <div className="text-gray-600 text-lg mt-2 font-medium">
                        Track and manage customer orders
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {filteredOrders?.length || 0} total orders
                      </div>
                    </div>
                  </div>
                  {/* Search and Filter Section */}
                  <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, or Status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-5 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
                      />
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <div className="relative w-full sm:w-auto">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white placeholder-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
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
                        {filteredOrders?.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl flex-shrink-0 shadow-sm">
                                  <AiOutlineShoppingCart className="text-gray-600" size={20} />
                                </div>
                                <span className="font-medium text-gray-800">#{order._id.slice(-6)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-gray-100 to-indigo-100 rounded-xl flex-shrink-0 shadow-sm">
                                  <MdOutlinePeopleAlt className="text-indigo-600" size={20} />
                                </div>
                                <span className="font-medium text-gray-800">{order.user?.name || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-gray-100 to-green-100 rounded-xl flex-shrink-0 shadow-sm">
                                  <BsCurrencyRupee className="text-green-600" size={20} />
                                </div>
                                <span className="font-medium text-gray-800">{formatIndianCurrency(order.totalPrice)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handlePreview(order)}
                                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                title="View Order Details"
                              >
                                <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Preview Modal */}
      {isModalOpen && selectedOrder && (
        <OrderPreviewModal
          isOpen={isModalOpen}
          order={selectedOrder}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AdminDashboardOrders;
