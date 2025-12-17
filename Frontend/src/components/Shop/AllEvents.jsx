import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { 
  AiOutlineDelete, 
  AiOutlineEye, 
  AiOutlineGift, 
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineFilter,
  AiOutlineCalendar,
  AiOutlineBarChart,
  AiOutlineClose
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import { BsCurrencyRupee, BsThreeDotsVertical } from "react-icons/bs";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { toast } from "react-toastify";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  // Enhanced filtering logic
  const filteredEvents = (events || []).filter((event) => {
    const name = String(event.name || '').toLowerCase();
    const id = String(event._id || '').toLowerCase();
    const description = String(event.description || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || 
                         id.includes(search) || 
                         description.includes(search);

    // Date filtering - check creation date, start date, and end date
    const eventCreatedDate = new Date(event.createdAt);
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || 
                       eventCreatedDate >= start || 
                       eventStartDate >= start || 
                       eventEndDate >= start;

    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await dispatch(deleteEvent(id));
        if (response.type === "deleteEventSuccess") {
          toast.success("Event deleted successfully!");
          dispatch(getAllEventsShop(seller._id));
        } else {
          toast.error("Failed to delete event. Please try again.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting event. Please try again.");
      }
    }
  };

  const handlePreview = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
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
      headerName: "Event ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineGift className="text-purple-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Event ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Event Name",
      minWidth: 200,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200 cursor-pointer">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BsCurrencyRupee className="mr-1" size={14} />
              <span className="font-bold text-sm">{params.value}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value > 0 
              ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
          }`}>
            {params.value > 0 ? `${params.value} units` : 'Out of Stock'}
          </div>
        </div>
      ),
    },
    {
      field: "sold",
      headerName: "Sold",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            {params.value} sold
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
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handlePreview(params.row)}
              title="Preview Event"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleDelete(params.row.id)}
              title="Delete Event"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              title="More Options"
            >
              <BsThreeDotsVertical size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
    },
  ];

  const row = [];

  filteredEvents.forEach((item) => {
    const { _id, ...itemWithoutId } = item;
    row.push({
      id: _id,
      name: item.name,
      price: formatIndianCurrency(item.discountPrice),
      Stock: item.stock,
      sold: item.sold_out,
      ...itemWithoutId // Include all event data for the modal
    });
  });

  return (
    <div className="w-full p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl shadow-2xl">
                <AiOutlineGift className="text-white" size={32} />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-blue-900 via-purple-800 to-blue-800 bg-clip-text text-transparent leading-tight">
                All Events
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage your promotional events with ease
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {filteredEvents.length} events in your store
                {(searchTerm || startDate) && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (Filtered from {events?.length || 0} total)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <Link to="/dashboard-create-event">
          <Button
            variant="contained"
            className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !text-white hover:!from-blue-600 hover:!to-purple-700 !transition-all !duration-300 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !rounded-xl !px-6 !py-3 !font-semibold"
            startIcon={<AiOutlinePlus size={20} />}
          >
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by name, ID, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
        </div>
        {(searchTerm || startDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full min-h-[70vh] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        
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
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%) !important;
              border-bottom: 2px solid rgba(59, 130, 246, 0.2) !important;
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
              color: #3b82f6 !important;
            }
            .MuiIconButton-root {
              color: #3b82f6 !important;
              transition: all 0.3s ease !important;
            }
            .MuiIconButton-root:hover {
              background: rgba(59, 130, 246, 0.1) !important;
              transform: scale(1.1) !important;
            }
          `}
        </style>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="w-full h-[200px] flex items-center justify-center bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <AiOutlineGift className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">
                {searchTerm || startDate ? "No events match your filters" : "No events found"}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full relative z-10">
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
          </div>
        )}
      </div>

      {/* Event Preview Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Event Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedEvent.name}</h3>
                  <p className="text-sm text-gray-500">Event ID: {selectedEvent._id}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">{formatIndianCurrency(selectedEvent.discountPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{selectedEvent.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sold Out:</span>
                    <span className="font-medium">{selectedEvent.sold_out}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{new Date(selectedEvent.startDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{new Date(selectedEvent.endDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              {/* Event Image */}
              {selectedEvent.images && Array.isArray(selectedEvent.images) && selectedEvent.images.length > 0 && selectedEvent.images[0]?.url ? (
                <div className="relative">
                  <img
                    src={selectedEvent.images[0].url}
                    alt={selectedEvent.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/400x300?text=No+Image"
                    alt={selectedEvent.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;