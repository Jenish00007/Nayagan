import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineShoppingCart, AiOutlineClose, AiOutlineEye, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from "react-icons/ai";
import { BsCurrencyRupee, BsFilter } from "react-icons/bs";
import { MdOutlineTrendingUp, MdOutlinePeopleAlt } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import OrderPreviewModal from '../Admin/OrderPreviewModal';

const AllOrders = () => {
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const dispatch = useDispatch();

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

    // Defensive: always use an array
    const safeOrders = Array.isArray(orders) ? orders : [];
    console.log('Redux orders:', safeOrders);

    // Show all orders, sorted by most recent
    const filteredOrders = Array.from(safeOrders).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('Filtered orders:', filteredOrders);

    const row = [];
    filteredOrders.forEach((item) => {
        const { _id, ...itemWithoutId } = item;
        row.push({
            id: _id || '',
            customerName: item.user?.name || "N/A",
            status: item.status || 'N/A',
            itemsQty: Array.isArray(item.cart) ? item.cart.length : 0,
            total: item.totalPrice ? formatIndianCurrency(item.totalPrice) : 'N/A',
            createdAt: new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            ...itemWithoutId
        });
    });
    console.log('Rows for DataGrid:', row);

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
                        <AiOutlineShoppingCart className="text-indigo-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Order ID</span>
                    </div>
                </div>
            ),
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 shadow-sm">
                        <MdOutlinePeopleAlt className="text-purple-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Customer</span>
                    </div>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 160,
            flex: 1,
            renderCell: (params) => {
                const status = params.getValue(params.id, "status");
                const statusConfig = {
                    Delivered: {
                        bg: "from-green-100 to-emerald-100",
                        text: "text-green-700",
                        border: "border-green-200",
                        icon: "✓",
                        label: "Delivered"
                    },
                    Processing: {
                        bg: "from-yellow-100 to-amber-100",
                        text: "text-yellow-700",
                        border: "border-yellow-200",
                        icon: "⟳",
                        label: "Processing"
                    },
                    Pending: {
                        bg: "from-blue-100 to-indigo-100",
                        text: "text-blue-700",
                        border: "border-blue-200",
                        icon: "⏳",
                        label: "Pending"
                    },
                    Cancelled: {
                        bg: "from-red-100 to-pink-100",
                        text: "text-red-700",
                        border: "border-red-200",
                        icon: "✕",
                        label: "Cancelled"
                    }
                };
                const config = statusConfig[status] || statusConfig.Processing;
                return (
                    <div className="flex items-center justify-start w-full">
                        <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm bg-gradient-to-r ${config.bg} ${config.text} border ${config.border}`}>
                            {config.label}
                        </div>
                    </div>
                );
            },
        },
        {
            field: "itemsQty",
            headerName: "Items",
            type: "number",
            minWidth: 160,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 shadow-sm">
                        <AiOutlineShoppingCart className="text-purple-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[80px]">
                        <span className="font-semibold text-gray-800 leading-tight">{params.value} {params.value === 1 ? 'Item' : 'Items'}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Total Items</span>
                    </div>
                </div>
            ),
        },
        {
            field: "total",
            headerName: "Total Amount",
            type: "number",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex-shrink-0 shadow-sm">
                        <BsCurrencyRupee className="text-green-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Amount Paid</span>
                    </div>
                </div>
            ),
        },
        {
            field: "createdAt",
            headerName: "Order Time",
            type: "number",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex-shrink-0 shadow-sm">
                        <MdOutlineTrendingUp className="text-gray-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{formatTime(params.value)}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Order Time</span>
                    </div>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => {
                return (
                    <div className="flex items-center justify-start gap-2 w-full">
                        <button
                            onClick={() => handlePreview(params.row)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="View Order Details"
                        >
                            <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="relative">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <span className="text-5xl filter drop-shadow-lg">🛍️</span>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                All Orders
                            </div>
                            <div className="text-gray-600 text-lg mt-2 font-medium">
                                Manage and monitor all orders
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {filteredOrders?.length || 0} orders in your shop
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
                            placeholder="Search by Order ID, Customer Name, or Status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full min-h-[70vh] relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>

                <div className="w-full relative z-10">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <DataGrid
                            rows={row}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            autoHeight
                            className="!border-none"
                            getRowHeight={() => 'auto'}
                            rowHeight={90}
                            componentsProps={{
                                footer: {
                                    sx: {
                                        position: 'relative',
                                        overflow: 'visible'
                                    }
                                },
                                panel: {
                                    sx: {
                                        overflow: 'visible'
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiDataGrid-root': {
                                    border: 'none !important',
                                    background: 'transparent !important',
                                    borderRadius: '20px !important',
                                    overflow: 'hidden !important'
                                },
                                '& .MuiDataGrid-main': {
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    marginTop: '8px !important',
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-virtualScrollerContent': {
                                    padding: '0 12px !important',
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-virtualScrollerRenderZone': {
                                    transform: 'none !important',
                                    position: 'relative !important',
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    position: 'relative !important',
                                    overflow: 'visible !important',
                                    marginTop: '20px !important',
                                    background: 'transparent !important',
                                    borderTop: '1px solid rgba(226, 232, 240, 0.5) !important'
                                },
                                '& .MuiDataGrid-panel': {
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-panelContent': {
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-cell': {
                                    display: 'flex !important',
                                    alignItems: 'center !important',
                                    justifyContent: 'flex-start !important',
                                    padding: '20px 24px !important',
                                    height: '100% !important',
                                    minHeight: '90px !important',
                                    borderBottom: '1px solid rgba(226, 232, 240, 0.3) !important',
                                    overflow: 'visible !important',
                                    background: 'transparent !important',
                                    transition: 'all 0.3s ease !important'
                                },
                                '& .MuiDataGrid-cell:hover': {
                                    background: 'rgba(255, 255, 255, 0.1) !important',
                                    transform: 'translateY(-1px) !important'
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    padding: '24px !important',
                                    height: 'auto !important',
                                    minHeight: '80px !important',
                                    alignItems: 'center !important',
                                    whiteSpace: 'normal !important',
                                    background: 'transparent !important',
                                    borderBottom: '2px solid rgba(79, 70, 229, 0.2) !important',
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: '800 !important',
                                    color: '#1e293b !important',
                                    whiteSpace: 'normal !important',
                                    lineHeight: '1.3 !important',
                                    display: 'flex !important',
                                    alignItems: 'center !important',
                                    textTransform: 'uppercase !important',
                                    fontSize: '0.85rem !important',
                                    letterSpacing: '0.1em !important',
                                    height: 'auto !important',
                                    minHeight: '40px !important',
                                    overflow: 'visible !important',
                                    textOverflow: 'unset !important'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%) !important',
                                    borderBottom: '2px solid rgba(79, 70, 229, 0.2) !important',
                                    overflow: 'visible !important',
                                    backdropFilter: 'blur(10px) !important'
                                },
                                '& .MuiDataGrid-row': {
                                    minHeight: '90px !important',
                                    marginBottom: '4px !important',
                                    overflow: 'visible !important',
                                    borderRadius: '12px !important',
                                    transition: 'all 0.3s ease !important'
                                },
                                '& .MuiDataGrid-row:hover': {
                                    background: 'rgba(255, 255, 255, 0.9) !important',
                                    transform: 'translateY(-2px) !important',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1) !important'
                                },
                                '& .MuiDataGrid-virtualScrollerContent': {
                                    overflow: 'visible !important'
                                },
                                '& .MuiDataGrid-virtualScrollerRenderZone': {
                                    overflow: 'visible !important'
                                },
                                '& .MuiTablePagination-root': {
                                    color: '#64748b !important',
                                    fontWeight: '600 !important'
                                },
                                '& .MuiTablePagination-selectIcon': {
                                    color: '#6366f1 !important'
                                },
                                '& .MuiIconButton-root': {
                                    color: '#6366f1 !important',
                                    transition: 'all 0.3s ease !important'
                                },
                                '& .MuiIconButton-root:hover': {
                                    background: 'rgba(99, 102, 241, 0.1) !important',
                                    transform: 'scale(1.1) !important'
                                }
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Order Preview Modal */}
            {isModalOpen && selectedOrder && (
                <OrderPreviewModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />
            )}
        </div>
    );
};

export default AllOrders;