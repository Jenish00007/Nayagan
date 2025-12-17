import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';
import axios from 'axios';
import { getAllProductsAdmin } from '../../redux/actions/product';
import { Plus, Package, Image, DollarSign, Tag, Box, X, Save } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);
  
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
    dispatch(getAllProductsAdmin());
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

  useEffect(() => {
    const product = allProducts?.find((item) => item._id === id);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category?._id || product.category,
        subcategory: product.subcategory?._id || product.subcategory,
        tags: product.tags,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        stock: product.stock,
        unit: product.unit,
        unitCount: product.unitCount,
        maxPurchaseQuantity: product.maxPurchaseQuantity
      });
      setImages(product.images);
    }
  }, [allProducts, id]);

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
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${server}/admin/product/${id}`,
        {
          ...formData,
          images,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success('Product updated successfully!');
      navigate('/admin-products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const discount = formData.originalPrice && formData.discountPrice ? 
    Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100) : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

                {/* Description */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none text-gray-800 hover:border-gray-300"
                  />
                </div>

                {/* Price and Stock Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="lr">Liter (lr)</option>
                      <option value="Pack">Pack</option>
                    </select>
                  </div>
                </div>

                {/* Max Purchase Quantity */}
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

                {/* Images Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Product Images *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Add more images</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.maxPurchaseQuantity || images.length === 0}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg ${
                        loading || !formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.maxPurchaseQuantity || images.length === 0
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
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 