import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { BsCurrencyRupee } from "react-icons/bs";

const AllRefundOrders = () => {
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
    }, [dispatch]);

    // Filter refund orders with enhanced search and date filtering
    const refundOrders = orders && orders.filter((item) => 
        item.status === "Processing refund" || 
        item.status === "Refund Success" || 
        item.status === "Refund Failed"
    );

    // Enhanced filtering logic
    const filteredRefundOrders = (refundOrders || []).filter((item) => {
        const orderId = String(item._id || '').toLowerCase();
        const status = String(item.status || '').toLowerCase();
        const customerName = String(item.user?.name || '').toLowerCase();
        const customerEmail = String(item.user?.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = orderId.includes(search) || 
                             status.includes(search) || 
                             customerName.includes(search) ||
                             customerEmail.includes(search);

        // Date filtering - check order date and refund date
        const orderDate = new Date(item.createdAt);
        const refundDate = new Date(item.refundDate || item.updatedAt);
        const start = startDate ? new Date(startDate) : null;

        const matchesDate = !start || 
                           orderDate >= start || 
                           refundDate >= start;

        return matchesSearch && matchesDate;
    });

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

    const columns = [
        { 
            field: "id", 
            headerName: "Order ID", 
            minWidth: 180, 
            flex: 0.8,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
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
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => {
                const status = params.value;
                const statusColors = {
                    "Processing refund": "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
                    "Refund Success": "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
                    "Refund Failed": "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200",
                };
                const color = statusColors[status] || "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
                
                return (
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${color}`}>
                        {status}
                    </div>
                );
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
                        {params.value} items
                    </div>
                </div>
            ),
        },
        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <BsCurrencyRupee className="mr-1" size={14} />
                            <span className="font-bold text-sm">{formatIndianCurrency(params.value)}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            field: " ",
            flex: 0.8,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.id}`}>
                        <Button className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                            <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const row = [];

    filteredRefundOrders &&
        filteredRefundOrders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.cart.length,
                total: item.totalPrice,
                status: item.status,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                        <div className="relative">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                        <span className="text-5xl filter drop-shadow-lg">🔄</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                                </div>
                                <div>
                                    <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                        All Refund Orders
                                    </div>
                                    <div className="text-gray-600 text-lg mt-2 font-medium">
                                        Manage your refund orders with ease
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {filteredRefundOrders?.length || 0} refund orders in your store
                                        {(searchTerm || startDate) && (
                                            <span className="ml-2 text-blue-600 font-medium">
                                                (Filtered from {refundOrders?.length || 0} total)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by order ID, status, customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[250px] pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white/50 backdrop-blur-sm shadow-sm"
                                />
                                <AiOutlineShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-[200px] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white/50 backdrop-blur-sm shadow-sm"
                                />
                            </div>
                            {(searchTerm || startDate) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStartDate("");
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

                        <style>
                            {`
                                .MuiDataGrid-root {
                                    border: none !important;
                                    background: transparent !important;
                                    border-radius: 20px !important;
                                    overflow: hidden !important;
                                }
                                .MuiDataGrid-main {
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-virtualScroller {
                                    margin-top: 8px !important;
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-virtualScrollerContent {
                                    padding: 0 12px !important;
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-virtualScrollerRenderZone {
                                    transform: none !important;
                                    position: relative !important;
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-footerContainer {
                                    position: relative !important;
                                    overflow: visible !important;
                                    margin-top: 20px !important;
                                    background: transparent !important;
                                    border-top: 1px solid rgba(226, 232, 240, 0.5) !important;
                                }
                                .MuiDataGrid-panel {
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-panelContent {
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-cell {
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: flex-start !important;
                                    padding: 20px 24px !important;
                                    height: 100% !important;
                                    min-height: 90px !important;
                                    border-bottom: 1px solid rgba(226, 232, 240, 0.3) !important;
                                    overflow: visible !important;
                                    background: transparent !important;
                                    transition: all 0.3s ease !important;
                                }
                                .MuiDataGrid-cell:hover {
                                    background: rgba(255, 255, 255, 0.1) !important;
                                    transform: translateY(-1px) !important;
                                }
                                .MuiDataGrid-columnHeader {
                                    padding: 24px !important;
                                    height: auto !important;
                                    min-height: 80px !important;
                                    align-items: center !important;
                                    white-space: normal !important;
                                    background: transparent !important;
                                    border-bottom: 2px solid rgba(79, 70, 229, 0.2) !important;
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-columnHeaderTitle {
                                    font-weight: 800 !important;
                                    color: #1e293b !important;
                                    white-space: normal !important;
                                    line-height: 1.3 !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    text-transform: uppercase !important;
                                    font-size: 0.85rem !important;
                                    letter-spacing: 0.1em !important;
                                    height: auto !important;
                                    min-height: 40px !important;
                                    overflow: visible !important;
                                    text-overflow: unset !important;
                                }
                                .MuiDataGrid-columnHeaders {
                                    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%) !important;
                                    border-bottom: 2px solid rgba(79, 70, 229, 0.2) !important;
                                    overflow: visible !important;
                                    backdrop-filter: blur(10px) !important;
                                }
                                .MuiDataGrid-row {
                                    min-height: 90px !important;
                                    margin-bottom: 4px !important;
                                    overflow: visible !important;
                                    border-radius: 12px !important;
                                    transition: all 0.3s ease !important;
                                }
                                .MuiDataGrid-row:hover {
                                    background: rgba(255, 255, 255, 0.9) !important;
                                    transform: translateY(-2px) !important;
                                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                                }
                                .MuiDataGrid-virtualScrollerContent {
                                    overflow: visible !important;
                                }
                                .MuiDataGrid-virtualScrollerRenderZone {
                                    overflow: visible !important;
                                }
                                .MuiTablePagination-root {
                                    color: #64748b !important;
                                    font-weight: 600 !important;
                                }
                                .MuiTablePagination-selectIcon {
                                    color: #6366f1 !important;
                                }
                                .MuiIconButton-root {
                                    color: #6366f1 !important;
                                    transition: all 0.3s ease !important;
                                }
                                .MuiIconButton-root:hover {
                                    background: rgba(99, 102, 241, 0.1) !important;
                                    transform: scale(1.1) !important;
                                }
                            `}
                        </style>

                        <div className="w-full relative z-10">
                            {filteredRefundOrders.length === 0 ? (
                                <div className="w-full h-[200px] flex items-center justify-center bg-white rounded-xl shadow-lg">
                                    <div className="text-center">
                                        <span className="text-5xl filter drop-shadow-lg">🔄</span>
                                        <p className="mt-4 text-gray-600">
                                            {searchTerm || startDate ? "No refund orders match your filters" : "No refund orders found"}
                                        </p>
                                    </div>
                                </div>
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
                                        '& .MuiDataGrid-cell': {
                                            overflow: 'visible'
                                        },
                                        '& .MuiDataGrid-row': {
                                            overflow: 'visible'
                                        },
                                        '& .MuiDataGrid-virtualScroller': {
                                            overflow: 'visible !important'
                                        },
                                        '& .MuiDataGrid-virtualScrollerContent': {
                                            overflow: 'visible !important'
                                        },
                                        '& .MuiDataGrid-virtualScrollerRenderZone': {
                                            overflow: 'visible !important'
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllRefundOrders;