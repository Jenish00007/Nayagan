import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineAppstore } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { BsFilter, BsClock } from "react-icons/bs";
import { server } from "../../server";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../Layout/Loader";

const AllModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (modules && Array.isArray(modules)) {
      const formattedRows = modules
        .filter(module => module && module._id)
        .map(module => ({
          id: module._id,
          _id: module._id,
          name: module.name || 'N/A',
          description: module.description || 'N/A',
          image: module.image || null,
          createdAt: module.createdAt || new Date(),
        }));
      setRows(formattedRows);
    }
  }, [modules]);

  // Filter modules based on search term and date range
  const filteredModules = rows.filter((module) => {
    const moduleName = String(module.name || "").toLowerCase();
    const moduleId = String(module.id || "").toLowerCase();
    const moduleDescription = String(module.description || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = moduleName.includes(search) || 
                         moduleId.includes(search) || 
                         moduleDescription.includes(search);

    const moduleDate = new Date(module.createdAt);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || moduleDate >= start;

    return matchesSearch && matchesDate;
  });

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/modules`, {
        withCredentials: true,
      });
      setModules(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Error fetching modules");
      setModules([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (selectedModule) {
        await axios.put(
          `${server}/modules/${selectedModule._id}`,
          formDataToSend,
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success("Module updated successfully!");
      } else {
        await axios.post(`${server}/modules`, formDataToSend, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Module created successfully!");
      }
      setOpen(false);
      setSelectedModule(null);
      setFormData({ name: "", description: "", image: null });
      fetchModules();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Error saving module");
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${server}/modules/${id}`, {
        withCredentials: true,
      });
      toast.success("Module deleted successfully!");
      fetchModules();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Error deleting module");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (module) => {
    setSelectedModule(module);
    setFormData({
      name: module.name,
      description: module.description,
      image: null
    });
    setImagePreview(module.image);
    setOpen(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "Module ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlinePlus className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value ? params.value.slice(-6) : 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Module ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div className="w-[50px] h-[50px] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <img
            src={params.value}
            alt={params.row.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineAppstore className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer truncate leading-tight">{params.value || 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Module Name</span>
          </div>
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-gray-200">
            {params.value || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            <div className="flex items-center">
              <BsClock className="mr-1" size={14} />
              <span>{new Date(params.value).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center justify-start gap-2 w-full">
          <button 
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handleEdit(params.row)}
            title="Edit Module"
          >
            <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handleDelete(params.row._id)}
            title="Delete Module"
          >
            <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-start w-full p-0 m-0">
      <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen p-0">
        <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-4">
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-6">
                <div className="relative">
                  <div className="p-2 sm:p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl">
                    <AiOutlineAppstore className="text-2xl sm:text-4xl text-white filter drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                </div>
                <div>
                  <div className="font-black text-2xl sm:text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                    All Modules
                  </div>
                  <div className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                    Manage and monitor all modules
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    {filteredModules?.length || 0} total modules
                    {(searchTerm || startDate) && (
                      <span className="ml-1 sm:ml-2 text-blue-600 font-medium">
                        (Filtered from {rows?.length || 0} total)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full relative overflow-hidden p-0">
            <div className="w-full relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[300px] pl-10 pr-2 sm:pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full sm:w-auto px-2 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedModule(null);
                    setFormData({ name: "", description: "", image: null });
                    setOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  <AiOutlinePlus size={18} />
                  <span>Add New Module</span>
                </button>
              </div>

              {loading ? (
                <Loader />
              ) : filteredModules.length === 0 ? (
                <div className="w-full flex items-center justify-center bg-white rounded-xl shadow-lg p-4">
                  <div className="text-center w-full">
                    <AiOutlineAppstore className="mx-auto text-gray-400" size={48} />
                    <p className="mt-4 text-gray-600 text-base sm:text-lg">No modules found</p>
                  </div>
                </div>
              ) : (
                <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-0 sm:p-4">
                  <DataGrid
                    rows={filteredModules}
                    columns={columns}
                    pageSize={12}
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
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-lg sm:text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                {selectedModule ? "Edit Module" : "Add New Module"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full h-48 sm:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview}
                            alt="Module preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, image: null });
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <AiOutlinePlus size={30} className="text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {selectedModule ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllModules; 