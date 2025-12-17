import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  getAllAdminBanners, 
  deleteAdminBanner,
  createAdminBanner,
  updateAdminBanner 
} from "../../redux/actions/adminBanner";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineAppstore, AiOutlinePlus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import { server } from "../../server";
import Loader from "../Layout/Loader";

const AdminBannersPage = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.adminBanner);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dispatch(getAllAdminBanners());
  }, [dispatch]);

  useEffect(() => {
    if (banners && Array.isArray(banners)) {
      const formattedRows = banners
        .filter(banner => banner && banner._id)
        .map(banner => ({
          id: banner._id,
          _id: banner._id,
          title: banner.title || 'N/A',
          description: banner.description || 'N/A',
          link: banner.link || 'N/A',
          image: banner.image || null,
          createdAt: banner.createdAt || new Date(),
          tags: Array.isArray(banner.tags) ? banner.tags : [],
        }));
      setRows(formattedRows);
    }
  }, [banners]);

  // Filter banners based on search term and date range
  const filteredBanners = rows.filter((banner) => {
    const bannerTitle = String(banner.title || "").toLowerCase();
    const bannerId = String(banner.id || "").toLowerCase();
    const bannerDescription = String(banner.description || "").toLowerCase();
    const bannerLink = String(banner.link || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = bannerTitle.includes(search) || 
                         bannerId.includes(search) || 
                         bannerDescription.includes(search) ||
                         bannerLink.includes(search);

    const bannerDate = new Date(banner.createdAt);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || bannerDate >= start;

    return matchesSearch && matchesDate;
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedBanner) {
        await dispatch(updateAdminBanner({ 
          id: selectedBanner._id, 
          formData: formDataToSend 
        }));
      } else {
        await dispatch(createAdminBanner(formDataToSend));
      }

      setOpen(false);
      setSelectedBanner(null);
      setFormData({
        title: "",
        description: "",
        link: "",
        image: null,
      });
    } catch (error) {
      toast.error(error.message || "Error saving banner");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAdminBanner(id));
      await dispatch(getAllAdminBanners());
    } catch (error) {
      toast.error(error.message || "Error deleting banner");
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      link: banner.link || "",
      image: null
    });
    setImagePreview(banner.image);
    setOpen(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "Banner ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineAppstore className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value ? params.value.slice(-6) : 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Banner ID</span>
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
            alt={params.row.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
        </div>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 180,
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineAppstore className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer truncate leading-tight">{params.value || 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Banner Title</span>
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
      field: "link",
      headerName: "Link",
      minWidth: 150,
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-green-200">
            {params.value || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="text-gray-600">
          {new Date(params.value).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
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
            title="Edit Banner"
          >
            <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handleDelete(params.row._id)}
            title="Delete Banner"
          >
            <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                  <AiOutlineAppstore className="text-4xl text-white filter drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
              </div>
              <div>
                <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                  All Banners
                </div>
                <div className="text-gray-600 text-lg mt-2 font-medium">
                  Manage and monitor all promotional banners
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {filteredBanners?.length || 0} total banners
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
        </div>

        <div className="w-full min-h-[70vh] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
          
          <div className="w-full relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search banners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <BsFilter size={18} />
                  <span className="text-sm font-medium">Filter</span>
                </button>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBanner(null);
                  setFormData({ title: "", description: "", link: "", image: null });
                  setOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <AiOutlineAppstore size={18} />
                <span className="text-sm font-medium">Add New Banner</span>
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : filteredBanners.length === 0 ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-xl shadow-lg">
                <div className="text-center">
                  <AiOutlineAppstore className="mx-auto text-gray-400" size={48} />
                  <p className="mt-4 text-gray-600">
                    {searchTerm || startDate ? "No banners match your filters" : "No banners found"}
                  </p>
                  {(searchTerm || startDate) && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStartDate("");
                      }}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-4">
                <DataGrid
                  rows={filteredBanners}
                  columns={columns}
                  pageSize={12}
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
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              {selectedBanner ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Banner preview"
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
                  {selectedBanner ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage; 