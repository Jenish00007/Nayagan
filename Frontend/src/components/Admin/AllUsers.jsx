import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import Loader from "../Layout/Loader";
import { AiOutlineClose } from "react-icons/ai";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, deleteUserLoading } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      const formattedRows = users
        .filter(item => item && item._id)
        .map(item => ({
          id: item._id,
          name: item.name || 'N/A',
          email: item.email || 'N/A',
          phoneNumber: item.phoneNumber || 'N/A',
          role: item.role || 'user',
          createdAt: item.createdAt || new Date(),
        }));
      setRows(formattedRows);
    }
  }, [users]);

  // Filter users based on search term and date range
  const filteredUsers = rows.filter((user) => {
    const userName = String(user.name || "").toLowerCase();
    const userEmail = String(user.email || "").toLowerCase();
    const userPhone = String(user.phoneNumber || "").toLowerCase();
    const userId = String(user.id || "").toLowerCase();
    const userRole = String(user.role || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = userName.includes(search) || 
                         userEmail.includes(search) || 
                         userPhone.includes(search) || 
                         userId.includes(search) ||
                         userRole.includes(search);

    const userDate = new Date(user.createdAt);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || userDate >= start;

    return matchesSearch && matchesDate;
  });

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id));
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const handlePreview = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineUser className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">User ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-green-200">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value === 'admin' 
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200' 
              : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200'
          }`}>
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineUser className="text-gray-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">
              {new Date(params.row.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Registration Date</span>
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-start gap-2 w-full">
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handlePreview(params.row)}
              title="Preview User"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleDelete(params.row)}
              title="Delete User"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
    },
  ];

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0">
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 max-w-md w-full mx-2 sm:mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Confirm Deletion</h3>
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 sm:gap-4">
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleteUserLoading}
            className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm sm:text-base disabled:opacity-50"
          >
            {deleteUserLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 sm:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-2 sm:gap-4">
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative">
              <div className="p-2 sm:p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl">
                <span className="text-2xl sm:text-5xl filter drop-shadow-lg">👥</span>
              </div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-2xl sm:text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                All Users
              </div>
              <div className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                Manage and monitor all registered users
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredUsers?.length || 0} users in your platform
                {(searchTerm || startDate) && (
                  <span className="ml-1 sm:ml-2 text-blue-600 font-medium">
                    (Filtered from {rows?.length || 0} total)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] pl-10 sm:pl-12 pr-3 sm:pr-6 py-2 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg text-sm sm:text-base"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
            <BsFilter size={16} />
            <span className="font-semibold">Filter</span>
          </button>
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
        ) : filteredUsers.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="text-center">
              <AiOutlineUser className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">No users found</p>
            </div>
          </div>
        ) : (
          <div className="w-full relative z-10 overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-0">
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                className="!border-none"
                getRowHeight={() => (window.innerWidth < 640 ? 60 : 'auto')}
                rowHeight={window.innerWidth < 640 ? 60 : 90}
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
                    padding: window.innerWidth < 640 ? '10px 8px !important' : '20px 24px !important',
                    height: '100% !important',
                    minHeight: window.innerWidth < 640 ? '60px !important' : '90px !important',
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
                    padding: window.innerWidth < 640 ? '10px !important' : '24px !important',
                    height: 'auto !important',
                    minHeight: window.innerWidth < 640 ? '40px !important' : '80px !important',
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
                    fontSize: window.innerWidth < 640 ? '0.75rem !important' : '0.85rem !important',
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
                    minHeight: window.innerWidth < 640 ? '60px !important' : '90px !important',
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
            </div>
          </div>
        )}
      </div>

      {/* User Preview Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-0">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-2 sm:mx-4 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={closeModal}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl">
                  <AiOutlineUser className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{selectedUser.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl">
                  <AiOutlineMail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg sm:rounded-xl">
                  <AiOutlinePhone className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{selectedUser.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl">
                  <AiOutlineUser className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{selectedUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add the delete confirmation modal */}
      {deleteConfirmOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default AllUsers;
