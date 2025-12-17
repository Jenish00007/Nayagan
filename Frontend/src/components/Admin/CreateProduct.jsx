import React, { useEffect, useState } from "react";
import { Plus, X, Save } from "lucide-react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.name || !formData.description || !formData.category || !formData.subcategory || !formData.originalPrice || !formData.discountPrice || !formData.stock || !formData.unit || !formData.unitCount || !formData.maxPurchaseQuantity || images.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${server}/admin/product`,
        { ...formData, images },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      toast.success('Product created successfully!');
      navigate('/admin-products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discount = formData.originalPrice && formData.discountPrice ?
    Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100) : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-2 py-4 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="mb-4 sm:mb-6 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Create New Product</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Fill in the details to add a new product</p>
          </div>
          <div className="bg-white/90 sm:bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-2 sm:p-6 md:p-8 space-y-4">
              {/* Name, Category, Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border rounded resize-none"
                />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Tags (comma separated)"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Prices & stock */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <input
                  type="text"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleNumberInputChange}
                  placeholder="Original Price"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleNumberInputChange}
                  placeholder="Discount Price"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleNumberInputChange}
                  placeholder="Stock"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Unit</option>
                  <option value="kg">Kilogram</option>
                  <option value="g">Gram</option>
                  <option value="pcs">Pieces</option>
                  <option value="ltr">Liter</option>
                  <option value="ml">Milliliter</option>
                  <option value="pack">Pack</option>
                </select>
                <input
                  type="number"
                  name="unitCount"
                  value={formData.unitCount}
                  onChange={handleNumberInputChange}
                  placeholder="Unit Count"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  name="maxPurchaseQuantity"
                  value={formData.maxPurchaseQuantity}
                  onChange={handleNumberInputChange}
                  placeholder="Max Purchase Qty"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                    <Plus className="mx-auto text-2xl text-gray-400 mb-1" />
                    <p className="text-gray-600 text-xs">Drag & drop or click to browse</p>
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt=""
                          className="object-cover w-full h-20 sm:h-24 md:h-28 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded w-full sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
