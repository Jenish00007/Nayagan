import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  AiOutlineDelete, 
  AiOutlineEye, 
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlinePercentage
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BsCurrencyRupee, BsThreeDotsVertical } from "react-icons/bs";

const AllCoupons = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [minAmount, setMinAmount] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [value, setValue] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

    const dispatch = useDispatch();

    useEffect(() => {
        fetchCoupons();
    }, [dispatch]);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${server}/coupon/get-coupon/${seller._id}`, {
                withCredentials: true,
            });
            setCoupons(response.data.couponCodes);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to fetch coupons");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await axios.delete(`${server}/coupon/delete-coupon/${id}`, { 
                    withCredentials: true 
                });
                toast.success("Coupon code deleted successfully!");
                fetchCoupons();
            } catch (error) {
                console.error("Error deleting coupon:", error);
                toast.error("Failed to delete coupon");
            }
        }
    };

    const handlePreview = (coupon) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCoupon(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${server}/coupon/create-coupon-code`,
                {
                    name,
                    minAmount,
                    maxAmount,
                    selectedProducts,
                    value,
                    shopId: seller._id,
                },
                { withCredentials: true }
            );
            toast.success("Coupon code created successfully!");
            setOpen(false);
            fetchCoupons();
            // Reset form
            setName("");
            setMinAmount(null);
            setMaxAmount(null);
            setSelectedProducts(null);
            setValue(null);
        } catch (error) {
            console.error("Error creating coupon:", error);
            toast.error(error.response?.data?.message || "Failed to create coupon");
        }
    };

    // Function to format currency in Indian format
    const formatIndianCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(amount);
    };

    const columns = [
        {
            field: "id",
            headerName: "Coupon ID",
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
                        <MdOutlineLocalOffer className="text-indigo-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Coupon ID</span>
                    </div>
                </div>
            ),
        },
        {
            field: "name",
            headerName: "Coupon Code",
            minWidth: 200,
            flex: 1,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="font-bold text-sm">{params.value}</span>
                    </div>
                </div>
            ),
        },
        {
            field: "value",
            headerName: "Discount",
            minWidth: 130,
            flex: 1,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <AiOutlinePercentage className="mr-1" size={14} />
                            <span className="font-bold text-sm">{params.value}%</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            field: "minAmount",
            headerName: "Min Amount",
            minWidth: 130,
            flex: 1,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-purple-200">
                        {params.value ? formatIndianCurrency(params.value) : 'No minimum'}
                    </div>
                </div>
            ),
        },
        {
            field: "maxAmount",
            headerName: "Max Amount",
            minWidth: 130,
            flex: 1,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => (
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-yellow-200">
                        {params.value ? formatIndianCurrency(params.value) : 'No maximum'}
                    </div>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 180,
            flex: 1,
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',
            renderCell: (params) => {
                return (
                    <div className="flex items-center justify-start gap-2 w-full">
                        <button 
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            onClick={() => handlePreview(params.row)}
                            title="Preview Coupon"
                        >
                            <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button 
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            onClick={() => handleDelete(params.row.id)}
                            title="Delete Coupon"
                        >
                            <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button 
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="More Options"
                        >
                            <BsThreeDotsVertical size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const rows = coupons.map((item) => {
        const { _id, ...itemWithoutId } = item;
        return {
            id: _id,
            name: item.name,
            value: item.value,
            minAmount: item.minAmount,
            maxAmount: item.maxAmount,
            selectedProducts: item.selectedProducts,
            ...itemWithoutId // Include all coupon data for the modal
        };
    });

    return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="relative">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <MdOutlineLocalOffer className="text-white" size={32} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                All Coupons
                            </div>
                            <div className="text-gray-600 text-lg mt-2 font-medium">
                                Manage your discount coupons with ease
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {coupons?.length || 0} coupons in your store
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                </div>
                <Button
                    variant="contained"
                    className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 !text-white hover:!from-indigo-600 hover:!to-purple-700 !transition-all !duration-300 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !rounded-xl !px-6 !py-3 !font-semibold"
                    startIcon={<AiOutlinePlus size={20} />}
                    onClick={() => setOpen(true)}
                >
                    Create New Coupon
                </Button>
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
                            border-bottom: 2px solid rgba(249, 115, 22, 0.2) !important;
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

                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full relative z-10">
                        <DataGrid
                            rows={rows}
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
                    </div>
                )}
            </div>

            {/* Create Coupon Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                <MdOutlineLocalOffer className="text-indigo-600" />
                                Create Coupon Code
                            </h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={name}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your coupon code name..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Percentage <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="value"
                                    value={value}
                                    required
                                    min="1"
                                    max="100"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Enter discount percentage (1-100)..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Amount
                                </label>
                                <input
                                    type="number"
                                    name="minAmount"
                                    value={minAmount}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => setMinAmount(e.target.value)}
                                    placeholder="Enter minimum amount..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Amount
                                </label>
                                <input
                                    type="number"
                                    name="maxAmount"
                                    value={maxAmount}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                    placeholder="Enter maximum amount..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selected Product
                                </label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    value={selectedProducts}
                                    onChange={(e) => setSelectedProducts(e.target.value)}
                                >
                                    <option value="">Choose a product</option>
                                    {products &&
                                        products.map((i) => (
                                            <option value={i.name} key={i.name}>
                                                {i.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Coupon Preview Modal */}
            {isModalOpen && selectedCoupon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                <MdOutlineLocalOffer className="text-indigo-600" />
                                Coupon Details
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Coupon Code Display */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
                                <div className="text-3xl font-bold mb-2">{selectedCoupon.name}</div>
                                <div className="text-xl opacity-90">{selectedCoupon.value}% OFF</div>
                            </div>

                            {/* Coupon Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Coupon ID:</span>
                                        <span className="font-medium">#{selectedCoupon._id.slice(-6)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="font-medium text-green-600">{selectedCoupon.value}%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Min Amount:</span>
                                        <span className="font-medium">
                                            {selectedCoupon.minAmount ? formatIndianCurrency(selectedCoupon.minAmount) : 'No minimum'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Max Amount:</span>
                                        <span className="font-medium">
                                            {selectedCoupon.maxAmount ? formatIndianCurrency(selectedCoupon.maxAmount) : 'No maximum'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Product:</span>
                                        <span className="font-medium">
                                            {selectedCoupon.selectedProducts || 'All products'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600">Active</span>
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

export default AllCoupons;