import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { motion } from "framer-motion";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopPreviewPage = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header with animated background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/admin-orders"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 group"
                        >
                            <AiOutlineArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Back to Orders</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                >
                    {/* Shop Info Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <ShopInfo isOwner={false} />
                        </motion.div>
                    </div>

                    {/* Shop Profile Data */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <ShopProfileData isOwner={false} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ShopPreviewPage;
