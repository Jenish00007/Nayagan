// AllProduct.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineClose, AiOutlineEdit, AiOutlineShopping } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, deleteProduct } from "../../redux/actions/product";
import { BsCurrencyRupee } from "react-icons/bs";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";

const AllProduct = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await dispatch(deleteProduct(id));
        if (response.type === "deleteProductSuccess") {
          toast.success("Product deleted successfully!");
          dispatch(getAllProducts());
        } else {
          toast.error("Failed to delete product. Please try again.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting product. Please try again.");
      }
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/admin-edit-product/${id}`;
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

  // Filtering logic
  const filteredProducts = (allProducts || []).filter((item) => {
    const name = String(item.name || '').toLowerCase();
    const id = String(item._id || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    const subcategory = String(item.subcategory || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      name.includes(search) ||
      id.includes(search) ||
      category.includes(search) ||
      subcategory.includes(search);
    const createdDate = new Date(item.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const matchesDate = !start || createdDate >= start;
    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 w-full">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm mb-1 sm:mb-0">
            <AiOutlineShopping className="text-indigo-600" size={18} />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-semibold text-gray-800 truncate leading-tight text-sm sm:text-base">
              #{params.value.slice(-6)}
            </span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">
              Product ID
            </span>
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
        <div className="relative w-16 h-16 rounded-xl overflow-visible sm:overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg ring-2 ring-white">
          <img
            src={params.row.images && params.row.images.length > 0 ? params.row.images[0] : "https://via.placeholder.com/50"}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Product Name",
      minWidth: 200,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
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
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BsCurrencyRupee className="mr-1" size={14} />
              <span className="font-bold text-sm">{params.value}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value > 0 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
          }`}>
            {params.value > 0 ? `${params.value} units` : 'Out of Stock'}
          </div>
        </div>
      ),
    },
    {
      field: "unit",
      headerName: "Unit",
      minWidth: 120,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-purple-200">
            {params.value}
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
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
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
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => openModal(params.row)}
              title="Preview Product"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleEdit(params.row.id)}
              title="Edit Product"
            >
              <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleDelete(params.row.id)}
              title="Delete Product"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
    },
  ];

  const row = [];

  filteredProducts.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      price: item.discountPrice,
      stock: item.stock,
      unit: item.unitCount && item.unit ? `${item.unitCount} ${item.unit}` : 'N/A',
      sold: item.sold || 0,
      images: item.images,
      description: item.description,
      category: item.category,
      subcategory: item.subcategory,
      tags: item.tags,
      originalPrice: item.originalPrice,
      discountPrice: item.discountPrice,
      shop: item.shop,
      createdAt: item.createdAt,
    });
  });

  return (
    <div className="w-full p-0 m-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 p-0 m-0">
        <div className="relative p-0 m-0">
          <div className="flex items-center gap-2 sm:gap-6 p-0 m-0">
            <div className="relative p-0 m-0">
              <div className="p-2 sm:p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl">
                <span className="text-2xl sm:text-5xl filter drop-shadow-lg">📦</span>
              </div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div className="p-0 m-0">
              <div className="font-black text-2xl sm:text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                All Products
              </div>
              <div className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                Manage all products across all shops
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredProducts.length} products total
                {(searchTerm || startDate) && (
                  <span className="ml-1 sm:ml-2 text-blue-600 font-medium">
                    (Filtered from {allProducts?.length || 0} total)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-4 p-0 m-0">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-0 m-0">
          <div className="relative flex-1 sm:flex-none p-0 m-0">
            <input
              type="text"
              placeholder="Search by name, ID, category, subcategory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] pl-10 pr-2 sm:pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
          </div>
          <div className="relative w-full sm:w-auto p-0 m-0">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-2 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base"
            />
          </div>
        </div>
        {(searchTerm || startDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
            }}
            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full relative overflow-hidden p-0 m-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full flex items-center justify-center bg-white rounded-xl shadow-lg p-0 m-0" style={{height:'120px'}}>
            <div className="text-center">
              <svg className="mx-auto text-gray-400" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <p className="mt-4 text-gray-600">
                {searchTerm || startDate ? "No products match your filters" : "No products found"}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full relative z-10 overflow-x-auto p-0 m-0">
            <div className="w-full min-w-0 sm:min-w-full p-0 m-0">
              <DataGrid
                rows={row}
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
        )}
      </div>

      {/* Enhanced Product Preview Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl sm:rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-white/20 w-full max-w-lg sm:max-w-5xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <AiOutlineEye className="text-white" size={20} />
                    </div>
                    Product Preview
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-white/80 hover:text-white focus:outline-none transition-all duration-200 p-1 sm:p-2 hover:bg-white/20 rounded-xl"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-white px-2 sm:px-6 py-3 sm:py-6">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-8">
                  {/* Product Images */}
                  <div className="space-y-2 sm:space-y-4">
                    <div className="relative w-full h-48 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
                      <img
                        src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : "https://via.placeholder.com/400"}
                        alt={selectedProduct.name || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 sm:gap-3">
                      {selectedProduct.images && selectedProduct.images.length > 1 && selectedProduct.images.slice(1).map((image, index) => (
                        <div key={index} className="relative w-full h-12 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                          <img
                            src={image}
                            alt={`${selectedProduct.name || "Product"} ${index + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">{selectedProduct.name || "Product Name"}</h4>
                      <div className="inline-block px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-sm">
                        {selectedProduct.category ? (typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category) : 'No Category'}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-inner">
                      <div className="flex items-center justify-between py-1 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-xs sm:text-base">Original Price:</span>
                        <span className="text-gray-500 line-through text-base sm:text-lg font-semibold">₹{selectedProduct.originalPrice || 0}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-xs sm:text-base">Discount Price:</span>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg">
                          <span className="text-base sm:text-xl font-bold">₹{selectedProduct.discountPrice || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1 sm:py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-xs sm:text-base">Stock:</span>
                        <div className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold shadow-sm ${
                          (selectedProduct.stock || 0) > 0 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                        }`}>
                          {(selectedProduct.stock || 0) > 0 ? `${selectedProduct.stock} units` : 'Out of Stock'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1 sm:py-2">
                        <span className="text-gray-600 font-medium text-xs sm:text-base">Total Sold:</span>
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold shadow-sm">
                          {selectedProduct.sold || 0} units
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <h5 className="text-base sm:text-lg font-bold text-gray-900">Description</h5>
                      <p className="text-gray-600 leading-relaxed bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 text-xs sm:text-base">
                        {selectedProduct.description || "No description available"}
                      </p>
                    </div>

                    {selectedProduct.tags && (
                      <div className="space-y-2 sm:space-y-3">
                        <h5 className="text-base sm:text-lg font-bold text-gray-900">Tags</h5>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(typeof selectedProduct.tags === 'string' 
                            ? selectedProduct.tags.split(',').map(tag => tag.trim())
                            : Array.isArray(selectedProduct.tags) 
                              ? selectedProduct.tags 
                              : []
                          ).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-blue-600 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 sm:gap-2 rounded-xl border border-transparent shadow-lg px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-sm sm:text-base font-semibold text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
                  onClick={closeModal}
                >
                  <AiOutlineClose size={16} />
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

export default AllProduct;
