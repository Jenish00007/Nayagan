import React, { useState, useEffect } from "react";
import { FiGift, FiCalendar, FiDollarSign, FiPackage, FiTag, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createAdminEvent } from "../../redux/actions/event";
import { getAllCategories } from "../../redux/actions/category";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, success } = useSelector((state) => state.events);
    const { categories } = useSelector((state) => state.category);
    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    // Add debug logging for categories
    useEffect(() => {
        console.log('Categories from Redux store:', categories);
    }, [categories]);

    useEffect(() => {
        if (success) {
            toast.success("Event created successfully!");
            navigate("/admin-events");
        }
    }, [success, navigate]);

    const handleStartDateChange = (e) => {
        const startDate = new Date(e.target.value);
        const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        setStartDate(e.target.value);
        setEndDate("");
        document.getElementById("end-date").min = minEndDate.toISOString().slice(0, 10);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const today = new Date().toISOString().slice(0, 10);
    const minEndDate = startDate ? new Date(new Date(startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";

    const handleImageChange = (e) => {
        e.preventDefault();
        let files = Array.from(e.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            if (!isValidType) {
                toast.error(`${file.name} is not a valid image type. Please use JPG, PNG or WEBP.`);
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large. Maximum size is 10MB.`);
            }
            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) return;

        // Create preview URLs
        const previews = validFiles.map(file => URL.createObjectURL(file));
        
        setImages(prevImages => [...prevImages, ...validFiles]);
        setImagePreview(prevPreviews => [...prevPreviews, ...previews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...imagePreview];
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newPreviews[index]);
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setImages(newImages);
        setImagePreview(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (!name || !description || !category || !originalPrice || !discountPrice || !stock || images.length === 0) {
            toast.error("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("originalPrice", originalPrice);
        formData.append("discountPrice", discountPrice);
        formData.append("stock", stock);
        formData.append("start_Date", startDate);
        formData.append("Finish_Date", endDate);
        
        images.forEach((image) => {
            formData.append("images", image);
        });

        dispatch(createAdminEvent(formData));
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <FiGift className="text-5xl text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create New Event
                    </h1>
                    <p className="text-lg text-gray-600">
                        Launch your next amazing event with our enhanced creation platform
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <FiPackage className="mr-2" />
                            Event Details
                        </h2>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Row 1: 4 Main Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Event Name */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiTag className="mr-2 text-blue-500" />
                                    Event Name <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    placeholder="Enter event name"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiTag className="mr-2 text-blue-500" />
                                    Category <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {categories && categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Original Price */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiDollarSign className="mr-2 text-green-500" />
                                    Original Price <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                    placeholder="Enter original price"
                                />
                            </div>

                            {/* Discount Price */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiDollarSign className="mr-2 text-red-500" />
                                    Discount Price <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={discountPrice}
                                    onChange={(e) => setDiscountPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                                    placeholder="Enter discount price"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiPackage className="mr-2 text-orange-500" />
                                    Stock <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                    placeholder="Enter stock quantity"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiTag className="mr-2 text-purple-500" />
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                    placeholder="Enter tags (comma separated)"
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiCalendar className="mr-2 text-teal-500" />
                                    Start Date <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="start-date"
                                    required
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    min={today}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <FiCalendar className="mr-2 text-red-500" />
                                    End Date <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="end-date"
                                    required
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    min={minEndDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FiTag className="mr-2 text-blue-500" />
                                Description <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                                placeholder="Describe your event in detail..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FiPackage className="mr-2 text-violet-500" />
                                Event Images <span className="text-red-500 ml-1">*</span>
                            </label>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-violet-100 rounded-full mb-3">
                                            <FiPackage className="text-2xl text-violet-600" />
                                        </div>
                                        <p className="text-base font-medium text-gray-700 mb-1">
                                            Click to upload images
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PNG, JPG, WEBP up to 10MB each
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {imagePreview.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {imagePreview.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Creating Event...' : '🚀 Create Event'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent; 