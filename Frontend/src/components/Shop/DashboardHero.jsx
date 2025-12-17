import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShoppingCart, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import { MdOutlineStorefront, MdOutlineTrendingUp, MdOutlinePeopleAlt, MdOutlineWavingHand } from "react-icons/md";
import { BsGraphUpArrow, BsCurrencyRupee } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const DashboardHero = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
        dispatch(getAllProductsShop(seller._id));
    }, [dispatch]);

    const availableBalance = seller?.availableBalance.toFixed(2);

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

    // Function to format time only
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
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

    const handlePreview = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Get recent orders (last 5)
    const recentOrders = orders?.slice(0, 5) || [];

    return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="relative">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <MdOutlineWavingHand className="text-white" size={28} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                Welcome back, {seller?.name}!
                            </div>
                            <div className="text-gray-600 text-lg mt-2 font-medium">
                                Here's what's happening with your store today
                        </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {new Date().toLocaleDateString('en-GB', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{orders?.length || 0}</p>
                            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                <BsGraphUpArrow className="text-green-500" />
                                +12% from last month
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                            <AiOutlineShoppingCart className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {formatIndianCurrency(orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0)}
                            </p>
                            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                <BsGraphUpArrow className="text-green-500" />
                                +8% from last month
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                            <AiOutlineMoneyCollect className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                {/* Available Balance */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Available Balance</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{formatIndianCurrency(availableBalance)}</p>
                            <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
                                <BsCurrencyRupee className="text-blue-500" />
                                Ready for withdrawal
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                            <BsCurrencyRupee className="text-white" size={24} />
                    </div>
                    </div>
                </div>

                {/* Active Products */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Active Products</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{products?.length || 0}</p>
                            <p className="text-indigo-600 text-sm mt-1 flex items-center gap-1">
                                <MdOutlineStorefront className="text-indigo-500" />
                                In your store
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                            <MdOutlineStorefront className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Orders Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <AiOutlineShoppingCart className="text-white" size={28} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-2xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                Latest Orders
                            </div>
                            <div className="text-gray-600 text-base mt-1 font-medium">
                                Recent customer orders
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {recentOrders?.length || 0} recent orders in your store
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard-orders">
                            <Button
                                variant="contained"
                                className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 !text-white hover:!from-indigo-600 hover:!to-purple-700 !transition-all !duration-300 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !rounded-xl !px-6 !py-3 !font-semibold"
                                endIcon={<AiOutlineArrowRight className="animate-pulse" />}
                            >
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : recentOrders?.length === 0 ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <div className="text-center">
                            <AiOutlineShoppingCart className="mx-auto text-gray-400" size={48} />
                            <p className="mt-4 text-gray-600">No recent orders found</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order._id.slice(-6)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.user?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                    'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatIndianCurrency(order.totalPrice)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => handlePreview(order)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                >
                                                    <AiOutlineEye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Preview Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-white/20">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <AiOutlineEye className="text-white" size={24} />
                                        </div>
                                        Order Details
                                    </h3>
                            <button
                                onClick={closeModal}
                                        className="text-white/80 hover:text-white focus:outline-none transition-all duration-200 p-2 hover:bg-white/20 rounded-xl"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                                </div>
                        </div>

                            <div className="bg-white px-6 py-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Order Summary */}
                                    <div className="space-y-6">
                                    <div className="space-y-3">
                                            <h4 className="text-3xl font-bold text-gray-900 leading-tight">Order #{selectedOrder._id?.slice(-6)}</h4>
                                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-semibold text-sm shadow-sm">
                                                {selectedOrder.status}
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 font-medium">Total Items:</span>
                                                <span className="text-gray-800 font-semibold">{selectedOrder.cart?.length || 0} items</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 font-medium">Total Amount:</span>
                                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                                                    <span className="text-xl font-bold">{formatIndianCurrency(selectedOrder.totalPrice)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 font-medium">Order Date:</span>
                                                <span className="text-gray-800 font-semibold">
                                                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                    {selectedOrder.createdAt && (
                                                        <>
                                                            <br />
                                                            <span className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Payment Status:</span>
                                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                                                    {selectedOrder.paymentInfo?.status || 'Paid'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="space-y-6">
                                        <h5 className="text-xl font-bold text-gray-900">Customer Information</h5>
                                        <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 font-medium">Name:</span>
                                                <span className="text-gray-800 font-semibold">{selectedOrder.user?.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 font-medium">Email:</span>
                                                <span className="text-gray-800 font-semibold">{selectedOrder.user?.email}</span>
                                </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-gray-600 font-medium">Phone:</span>
                                                <span className="text-gray-800 font-semibold">{selectedOrder.user?.phoneNumber}</span>
                                        </div>
                                        </div>

                                        <h5 className="text-xl font-bold text-gray-900">Shipping Address</h5>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-gray-600 leading-relaxed">
                                                {selectedOrder.shippingAddress?.address1}, {selectedOrder.shippingAddress?.address2}<br />
                                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                                                {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details Section */}
                                {selectedOrder.cart && selectedOrder.cart.length > 0 && (
                                    <div className="mt-10 w-full">
                                        <h5 className="text-xl font-bold text-gray-900 mb-2">Products</h5>
                                        <div className="flex items-center text-gray-700 mb-4 text-sm">
                                            <span className="mr-6 font-medium">Total Unique Products: <span className="font-bold">{selectedOrder.cart.length}</span></span>
                                            <span className="font-medium">Total Quantity: <span className="font-bold">{selectedOrder.cart.reduce((acc, item) => acc + (item.quantity || 0), 0)}</span></span>
                            </div>
                                        <div className="divide-y rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 w-full">
                                            {selectedOrder.cart.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 w-full">
                                                    <img
                                                        src={item.images?.[0] || item.image || '/no-image.png'}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg border"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-800">{item.name}</div>
                                                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                                </div>
                                                    <div className="flex flex-col items-end min-w-[120px]">
                                                        <span className="text-gray-700 text-sm">Unit Price:</span>
                                                        <span className="font-semibold text-gray-800">{formatIndianCurrency(item.price)}</span>
                                                        </div>
                                                    <div className="flex flex-col items-end min-w-[120px]">
                                                        <span className="text-gray-700 text-sm">Subtotal:</span>
                                                        <span className="font-semibold text-gray-800">{formatIndianCurrency(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                )}
                                </div>

                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 flex justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-base font-semibold text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
                                    onClick={closeModal}
                                >
                                    <AiOutlineClose size={18} />
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHero;