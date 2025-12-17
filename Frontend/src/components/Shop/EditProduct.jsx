import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';
import axios from 'axios';
import { getAllProductsShop } from '../../redux/actions/product';
import { Plus, Package, Image, DollarSign, Tag, Box, X, Save } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    unit: "",
    unitCount: "",
    maxPurchaseQuantity: ""
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
    fetchCategories();
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

  useEffect(() => {
    const product = products?.find((item) => item._id === id);
    if (product) {
      console.log("Found product:", product); // Debug log
      const updatedFormData = {
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        subcategory: product.subcategory?._id || product.subcategory || "",
        tags: product.tags || "",
        originalPrice: product.originalPrice || "",
        discountPrice: product.discountPrice || "",
        stock: product.stock || "",
        unit: product.unit || "",
        unitCount: product.unitCount || "",
        maxPurchaseQuantity: product.maxPurchaseQuantity || ""
      };
      console.log("Setting form data:", updatedFormData); // Debug log
      setFormData(updatedFormData);
      setImages(product.images || []);
    }
  }, [products, id]);

  // Add a debug effect to monitor formData changes
  useEffect(() => {
    console.log("Current form data:", formData);
  }, [formData]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${server}/categories`);
      setCategories(response.data.data || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.error || "Error fetching categories");
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${server}/subcategories`);
      const filteredSubcategories = response.data.data.filter(
        sub => sub.category._id === categoryId
      );
      setSubcategories(filteredSubcategories);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.error || "Error fetching subcategories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || !formData.subcategory || 
        !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || 
        !formData.unitCount || !formData.maxPurchaseQuantity || images.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/product/update-product/${id}`,
        {
          ...formData,
          images,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      toast.success('Product updated successfully!');
      navigate('/dashboard-products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const discount = formData.originalPrice && formData.discountPrice ? 
    Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 px-4 sm:px-6 lg:px-8">
      {/* Floating particles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        {/* Compact Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3 transform hover:scale-105 transition-transform duration-300">
            <Package className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Edit Product
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Update your product details and information
          </p>
        </div>
        
        {/* Main Form - Enhanced with wider layout */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Product Details Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Product Information
                </h2>
                
                {/* Product Name, Category, Subcategory in same row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Subcategory *</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.category}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    >
                      <option value="">Select a subcategory</option>
                      {subcategories.map((subcat) => (
                        <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description and Tags in wider layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Describe your product in detail..."
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 resize-none hover:border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g. electronics, gadgets, accessories"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section - Enhanced grid layout */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Pricing & Inventory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Original Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input
                        type="text"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleNumberInputChange}
                        required
                        placeholder="1000"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Discount Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input
                        type="text"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleNumberInputChange}
                        required
                        placeholder="900"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Stock Quantity *</label>
                    <input
                      type="text"
                      name="stock"
                      value={formData.stock}
                      onChange={handleNumberInputChange}
                      required
                      placeholder="50"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Unit *</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    >
                      <option value="">Select unit</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="ltr">Liter (ltr)</option>
                      <option value="ml">Milliliter (ml)</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Unit Count *</label>
                    <input
                      type="number"
                      name="unitCount"
                      value={formData.unitCount}
                      onChange={handleNumberInputChange}
                      required
                      placeholder="1"
                      min="1"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Max Purchase Quantity *</label>
                    <input
                      type="number"
                      name="maxPurchaseQuantity"
                      value={formData.maxPurchaseQuantity}
                      onChange={handleNumberInputChange}
                      required
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                    />
                  </div>
                  
                  {/* Price preview in the same row */}
                  <div className="flex flex-col justify-center">
                    {formData.originalPrice && formData.discountPrice && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-xl border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Preview:</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">₹{formData.discountPrice}</span>
                            <span className="text-sm text-gray-500 line-through">₹{formData.originalPrice}</span>
                          </div>
                          {discount > 0 && (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium w-fit">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload Section - Compact */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Product Images *
                </h2>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group-hover:scale-[1.01]">
                    <Image className="mx-auto text-3xl text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                    <p className="text-gray-600 font-medium mb-1">Drag & drop images here, or click to browse</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {/* Image Preview Grid - More compact */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded text-center font-medium">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    disabled={loading || !formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.unitCount || !formData.maxPurchaseQuantity || images.length === 0}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg ${
                      loading || !formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.unitCount || !formData.maxPurchaseQuantity || images.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25 hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating Product...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Update Product
                      </div>
                    )}
                  </button>
                  
                  {/* Form validation hints */}
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-gray-500">
                      {!formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.unitCount || !formData.maxPurchaseQuantity || images.length === 0
                        ? 'Fill all required fields'
                        : 'Ready to update!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer section with tips - More compact */}
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Image className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">High Quality Images</h3>
            <p className="text-xs text-gray-600">Upload clear, well-lit photos from multiple angles.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">Detailed Description</h3>
            <p className="text-xs text-gray-600">Write compelling descriptions with key features.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">Competitive Pricing</h3>
            <p className="text-xs text-gray-600">Research market prices to set competitive pricing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 