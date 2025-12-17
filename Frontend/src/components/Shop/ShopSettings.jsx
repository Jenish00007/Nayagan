import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera, AiOutlineShop, AiOutlineInfoCircle, AiOutlinePhone, AiOutlineEnvironment, AiOutlineMail } from "react-icons/ai";
import { FiShoppingBag, FiMapPin, FiHash } from "react-icons/fi";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ShopSettings = () => {
    const { seller } = useSelector((state) => state.seller);
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState(seller && seller.name);
    const [description, setDescription] = useState(seller && seller.description ? seller.description : "");
    const [address, setAddress] = useState(seller && seller.address);
    const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
    const [zipCode, setZipcode] = useState(seller && seller.zipCode);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            setIsLoading(true);
            await axios.put(`${server}/shop/update-shop-avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateHandler = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            await axios.put(`${server}/shop/update-seller-info`, {
                name,
                address,
                zipCode,
                phoneNumber,
                description,
            }, { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true 
            });
            toast.success("Shop info updated successfully!");
            dispatch(loadSeller());
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${server}/shop/logout`, { withCredentials: true });
            dispatch({ type: "SELLER_LOGOUT_SUCCESS" });
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                <FiShoppingBag className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                                    Shop Settings
                                </h1>
                                <p className="text-gray-600 mt-1">Manage your shop profile and information</p>
                            </div>
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="relative">
                                <img
                                    src={avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller.avatar}`}
                                    alt=""
                                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full object-cover border-4 border-blue-100 shadow-lg transition-all duration-300 group-hover:scale-105"
                                />
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-110">
                                <input
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    onChange={handleImage}
                                    accept="image/*"
                                />
                                <label htmlFor="image" className="cursor-pointer">
                                    <AiOutlineCamera className="text-white text-xl" />
                                </label>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click the camera icon to update your shop avatar</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={updateHandler} className="space-y-6">
                        {/* Shop Name */}
                        <div className="relative">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AiOutlineShop className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your shop name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Description
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <AiOutlineInfoCircle className="text-gray-400" />
                                </div>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your shop description"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="relative">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMapPin className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your shop address"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AiOutlinePhone className="text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Zip Code */}
                        <div className="relative">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                                Zip Code <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiHash className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="zipCode"
                                    value={zipCode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your zip code"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Shop Information'
                                )}
                            </button>
                        </div>
                    </form>
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopSettings;