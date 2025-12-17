import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil, BsCurrencyDollar, BsShop, BsClock, BsCheckCircle, BsEye } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axios.get(`${server}/withdraw/get-all-withdraw-request`, {
          withCredentials: true,
        });
        if (res.data && res.data.withdraws) {
          setData(res.data.withdraws);
          console.log(res.data.withdraws);
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        toast.error("Failed to fetch withdrawal requests");
      }
    };
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedRows = data
        .filter(item => item && item._id && item.seller)
        .map(item => ({
          id: item._id || '',
          shopId: item.seller._id || '',
          name: item.seller.shopName || item.seller.name || 'N/A',
          amount: item.amount || 0,
          status: item.status || 'Processing',
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date(),
          bankName: item.bankName || 'N/A',
          bankAccountNumber: item.bankAccountNumber || 'N/A',
          bankIfscCode: item.bankIfscCode || 'N/A',
          transactionId: item.transactionId || 'N/A',
          paymentMethod: item.paymentMethod || 'Bank Transfer',
          processingFee: item.processingFee || 0,
          seller: item.seller,
        }));
      setRows(formattedRows);
    }
  }, [data]);

  // Filter withdrawals based on search term and date range
  const filteredWithdrawals = rows.filter((withdraw) => {
    const withdrawId = String(withdraw.id || "").toLowerCase();
    const shopName = String(withdraw.seller?.name || withdraw.seller?.shopName || "").toLowerCase();
    const shopId = String(withdraw.shopId || "").toLowerCase();
    const status = String(withdraw.status || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = withdrawId.includes(search) || 
                         shopName.includes(search) || 
                         shopId.includes(search) || 
                         status.includes(search);

    const withdrawDate = new Date(withdraw.createdAt);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || withdrawDate >= start;

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

  const handlePreview = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedWithdraw(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "Withdraw ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <BsCurrencyDollar className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Withdraw ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "shopName",
      headerName: "Shop Name",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-purple-200">
            <div className="flex items-center">
              <BsShop className="mr-1" size={14} />
              <span>{params.row.seller?.name || "N/A"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-green-200">
            <div className="flex items-center">
              <BsCurrencyDollar className="mr-1" size={14} />
              <span>{formatIndianCurrency(params.value)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value === 'Succeed' 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
              : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200'
          }`}>
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Request Time",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            <div className="flex items-center">
              <BsClock className="mr-1" size={14} />
              <span>{formatTime(params.value)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex-shrink-0 shadow-sm">
            <BsCurrencyDollar className="text-gray-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">
              {new Date(params.row.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Request Date</span>
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
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handlePreview(params.row)}
              title="Preview Withdraw"
            >
              <BsEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            {params.row.status === "Processing" && (
              <button
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                onClick={() => {
                  setWithdrawData(params.row);
                  setOpen(true);
                }}
                title="Approve Withdraw"
              >
                <BsCheckCircle size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.seller._id,
        },
        { withCredentials: true }
      );
      
      if (res.data && res.data.success) {
        // Update the local data state
        const updatedData = data.map((item) => 
          item._id === withdrawData.id 
            ? { ...item, status: "succeed", updatedAt: new Date() }
            : item
        );
        setData(updatedData);
        toast.success("Withdraw request updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      toast.error(error.response?.data?.message || "Failed to update withdrawal request");
    }
  };

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <span className="text-5xl filter drop-shadow-lg">💰</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                Withdraw Requests
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage and process seller withdrawal requests
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {filteredWithdrawals?.length || 0} pending requests
                {(searchTerm || startDate) && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (Filtered from {rows?.length || 0} total)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search withdrawals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] pl-12 pr-6 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
            />
          </div>
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
          <DataGrid
            rows={filteredWithdrawals}
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
      </div>

      {/* Withdraw Preview Modal */}
      {isPreviewOpen && selectedWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Withdraw Details</h2>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RxCross1 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Withdraw Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Withdraw Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Withdraw ID:</span>
                      <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">#{selectedWithdraw.id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">{selectedWithdraw.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium px-3 py-1 rounded-lg ${
                        selectedWithdraw.status === 'Succeed' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                          : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700'
                      }`}>
                        {selectedWithdraw.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Request Date:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">{formatDateTime(selectedWithdraw.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">
                        {formatDateTime(selectedWithdraw.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.bankAccountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">IFSC Code:</span>
                      <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.bankIfscCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shop Name:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">{selectedWithdraw.seller?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shop ID:</span>
                      <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">#{selectedWithdraw.shopId.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.seller?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.seller?.phoneNumber || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">
                        {selectedWithdraw.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">
                        {formatIndianCurrency(selectedWithdraw.processingFee)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedWithdraw.status === "Processing" && (
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setWithdrawData(selectedWithdraw);
                    setOpen(true);
                    setIsPreviewOpen(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Approve Withdraw
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {open && withdrawData && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded-lg shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Update Withdraw Status</h1>
              <RxCross1 
                size={25} 
                onClick={() => setOpen(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-300"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <select
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={withdrawStatus}
              >
                <option value="Processing">Processing</option>
                <option value="Succeed">Succeed</option>
              </select>
            </div>

            <button
              type="submit"
              className={`${styles.button} w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300`}
              onClick={handleSubmit}
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
