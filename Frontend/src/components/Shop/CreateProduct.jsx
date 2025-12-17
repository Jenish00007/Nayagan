import React, { useEffect, useState } from "react";
import { Plus, Package, Image, DollarSign, Tag, X, Camera } from "lucide-react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.seller);
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
    maxPurchaseQuantity: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) fetchSubcategories(formData.category);
    else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${server}/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(`${server}/subcategories`);
      const filtered = res.data.data.filter((sub) => sub.category._id === categoryId);
      setSubcategories(filtered);
    } catch (err) {
      toast.error("Error fetching subcategories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    let files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.subcategory ||
      !formData.originalPrice ||
      !formData.discountPrice ||
      !formData.stock ||
      !formData.unit ||
      !formData.unitCount ||
      !formData.maxPurchaseQuantity ||
      images.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      data.append("shopId", seller._id);
      images.forEach((img) => data.append("images", img));

      await axios.post(`${server}/product/create-product`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created successfully!");
      setFormData({
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
        maxPurchaseQuantity: "",
      });
      setImages([]);
      navigate("/dashboard-products");
    } catch (err) {
      toast.error("Error creating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-3 px-2 sm:px-4">
      <div className="w-full md:max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow mb-2">
            <Package className="text-lg sm:text-xl text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Create New Product
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Image className="mx-auto text-2xl text-gray-400 mb-1" />
                  <p className="text-gray-600 text-xs">Drag & drop or click to browser</p>
                  <label className="mt-1 inline-flex items-center gap-1 text-blue-600 cursor-pointer text-xs">
                    <Camera className="w-4 h-4" /> Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
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
  );
};

export default CreateProduct;
