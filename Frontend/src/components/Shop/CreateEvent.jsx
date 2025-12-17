import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FiGift, FiCalendar, FiDollarSign, FiPackage, FiTag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createevent } from "../../redux/actions/event";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, success } = useSelector((state) => state.events);

    // Mock data for categories
    const categoriesData = [
        { title: "Electronics" },
        { title: "Fashion" },
        { title: "Sports" },
        { title: "Books" },
        { title: "Home & Garden" },
        { title: "Beauty" },
        { title: "Automotive" },
        { title: "Food & Beverage" }
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
        
        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            toast.error('Only JPEG, PNG, GIF and WEBP images are allowed');
            return;
        }
        
        // Validate file sizes (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            toast.error('Some files are too large. Maximum size is 5MB');
            return;
        }
        
        setImages((prevImages) => [...prevImages, ...files]);
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

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            toast.error("Start date cannot be in the past");
            return;
        }

        if (end <= start) {
            toast.error("End date must be after start date");
            return;
        }

        // Validate prices
        if (parseFloat(discountPrice) >= parseFloat(originalPrice)) {
            toast.error("Discount price must be less than original price");
            return;
        }

        // Validate stock
        if (parseInt(stock) <= 0) {
            toast.error("Stock must be greater than 0");
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

        dispatch(createevent(formData));
    };

    useEffect(() => {
        if (success) {
            toast.success("Event created successfully!");
            navigate("/shop-events");
        }
    }, [success, navigate]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Mobile Navigation */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <FiGift className="text-xl text-white" />
                        </div>
                        <span className="ml-3 text-lg font-bold text-gray-800">Create Event</span>
                    </div>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                        {isMenuOpen ? (
                            <AiOutlineClose className="text-xl text-gray-600" />
                        ) : (
                            <AiOutlineMenu className="text-xl text-gray-600" />
                        )}
                    </button>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? "block" : "hidden"} bg-white/95 backdrop-blur-md border-t border-gray-100`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <button className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Dashboard
                        </button>
                        <button className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-blue-600 bg-blue-50">
                            Events
                        </button>
                        <button className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Products
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 lg:pt-12 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="hidden lg:flex justify-center mb-6">
                            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <FiGift className="text-5xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Create New Event
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Launch your next amazing event with our enhanced creation platform
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <FiPackage className="mr-3" />
                                Event Details
                            </h2>
                        </div>
                        
                        <div className="p-8 lg:p-12 space-y-8">
                            {/* Row 1: 4 Main Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {/* Event Name */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiTag className="mr-2 text-blue-500" />
                                        Event Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                        placeholder="Enter event name"
                                    />
                                </div>

                                {/* Original Price */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiDollarSign className="mr-2 text-green-500" />
                                        Original Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={originalPrice}
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Discount Price */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiDollarSign className="mr-2 text-orange-500" />
                                        Discount Price <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            required
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiPackage className="mr-2 text-purple-500" />
                                        Stock <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                        placeholder="Enter quantity"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Category, Tags, and Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {/* Category */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiTag className="mr-2 text-indigo-500" />
                                        Category <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    >
                                        <option value="">Choose category</option>
                                        {categoriesData.map((category) => (
                                            <option key={category.title} value={category.title}>
                                                {category.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FiTag className="mr-2 text-pink-500" />
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                        placeholder="Enter tags"
                                    />
                                </div>

                                {/* Start Date */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
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
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="xl:col-span-1">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
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
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Description - Full Width */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                    <FiTag className="mr-2 text-blue-500" />
                                    Description <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white resize-none"
                                    placeholder="Describe your event in detail..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
                                    <FiPackage className="mr-2 text-violet-500" />
                                    Event Images <span className="text-red-500 ml-1">*</span>
                                </label>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition-colors bg-gray-50 hover:bg-violet-50">
                                    <input
                                        type="file"
                                        id="images"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="images" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <div className="p-4 bg-violet-100 rounded-full mb-4">
                                                <FiPackage className="text-3xl text-violet-600" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                Click to upload images
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG up to 10MB each
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Image Preview */}
                                {images.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index}`}
                                                    className="h-24 w-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <AiOutlinePlusCircle className="transform rotate-45 text-sm" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                >
                                    🚀 Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;