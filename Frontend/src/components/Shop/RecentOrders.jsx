import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineShoppingCart, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import { MdOutlinePeopleAlt, MdOutlineTrendingUp } from "react-icons/md";
import { BsCurrencyRupee } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import Loader from "../Layout/Loader";

const RecentOrders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrderDate, setSelectedOrderDate] = useState("");
    const [selectedOrderDateISO, setSelectedOrderDateISO] = useState("");

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
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

    // Helper to format a Date object to '7 Jun 2025'
    const formatDisplayDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Function to format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `${formattedDate} ${formattedTime}`;
    };

    const row = [];

    orders &&
        orders.forEach((item) => {
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

    // Enhanced filtering logic
    const filteredLatestOrders = row.filter(orderRow => {
        const orderId = ("#" + orderRow.id.slice(-6)).toLowerCase();
        const customerName = String(orderRow.customerName || '').toLowerCase();
        const status = String(orderRow.status || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = orderId.includes(search) || 
                             customerName.includes(search) || 
                             status.includes(search);

        let matchesDate = true;
        if (selectedOrderDateISO) {
            const pickedDate = new Date(selectedOrderDateISO);
            const formattedPickedDate = formatDisplayDate(pickedDate);
            matchesDate = orderRow.createdAt === formattedPickedDate;
        }
        
        return matchesSearch && matchesDate;
    });

    return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="relative">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <AiOutlineShoppingCart className="text-white" size={28} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                Recent Orders
                            </div>
                            <div className="text-gray-600 text-lg mt-2 font-medium">
                                Track and manage customer orders
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {filteredLatestOrders.length} recent orders
                                {(searchTerm || selectedOrderDate) && (
                                    <span className="ml-2 text-blue-600 font-medium">
                                        (Filtered from {orders?.length || 0} total)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                </div>
                {/* Search and Filter Section */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by Order ID, customer, status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="date"
                            value={selectedOrderDate}
                            onChange={(e) => {
                                setSelectedOrderDate(e.target.value);
                                setSelectedOrderDateISO(e.target.value);
                            }}
                            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
                        />
                    </div>
                    {(searchTerm || selectedOrderDate) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedOrderDate("");
                                setSelectedOrderDateISO("");
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full min-h-[70vh] relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full relative z-10">
                        {filteredLatestOrders.length === 0 ? (
                            <div className="w-full h-[200px] flex items-center justify-center bg-white rounded-xl shadow-lg">
                                <div className="text-center">
                                    <AiOutlineShoppingCart className="mx-auto text-gray-400" size={48} />
                                    <p className="mt-4 text-gray-600">
                                        {searchTerm || selectedOrderDate ? "No orders match your filters" : "No orders found"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {filteredLatestOrders.slice(0, 10).map((orderRow) => {
                                                // Find the full order object from orders
                                                const fullOrder = orders.find(o => o._id === orderRow.id);
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
                                                            <span className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
                                                                orderRow.status === 'Delivered' 
                                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                                                                    : orderRow.status === 'Processing'
                                                                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200'
                                                                    : orderRow.status === 'Cancelled'
                                                                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                                                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                                                            }`}>
                                                                {orderRow.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <BsCurrencyRupee className="text-green-600" size={16} />
                                                                <span className="font-medium text-gray-700">{orderRow.total}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <MdOutlineTrendingUp className="text-purple-600" size={16} />
                                                                <span className="text-gray-700">{orderRow.createdAt}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handlePreview(fullOrder)}
                                                                    className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                                                    title="View Order Details"
                                                                >
                                                                    <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                                                </button>
                                                                <Link to={`/order/${orderRow.id}`}>
                                                                    <button 
                                                                        className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                                                        title="View Order"
                                                                    >
                                                                        <AiOutlineArrowRight size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Preview Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Information */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Order ID:</span>
                                            <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">#{selectedOrder._id.slice(-6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Amount:</span>
                                            <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">{formatIndianCurrency(selectedOrder.totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-medium px-3 py-1 rounded-lg ${
                                                selectedOrder.status === 'Delivered' 
                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                                                    : selectedOrder.status === 'Processing'
                                                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700'
                                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700'
                                            }`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Order Date & Time:</span>
                                            <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">{formatDateTime(selectedOrder.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{selectedOrder.user?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{selectedOrder.user?.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium">{selectedOrder.user?.phoneNumber || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.cart?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.name}</h4>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Quantity:</span>
                                                            <span className="font-medium text-gray-700">{item.qty}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Price:</span>
                                                            <span className="font-medium text-gray-700">₹{item.price}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Total:</span>
                                                            <span className="font-medium text-gray-700">₹{item.price * item.qty}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="font-medium text-right">{selectedOrder.shippingAddress?.address || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">City:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.city || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">State:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.state || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Country:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.country || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Zip Code:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.zipCode || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentOrders; 