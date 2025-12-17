import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import ProductCard from "../Route/ProductCard/ProductCard";
import { getAllEventsShop } from "../../redux/actions/event";
import { AiFillShopping, AiFillStar, AiFillCalendar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const ShopProfileData = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(getAllProductsShop(id));
            dispatch(getAllEventsShop(id));
        }
    }, [dispatch, id]);

    const [active, setActive] = useState(1);

    const allReviews =
        products && products.map((product) => product.reviews).flat();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="p-6">
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-gray-100">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActive(1)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 relative ${
                        active === 1
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                    <AiFillShopping size={20} />
                    <span>Products</span>
                    {active === 1 && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                        />
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActive(2)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 relative ${
                        active === 2
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                    <AiFillStar size={20} />
                    <span>Reviews</span>
                    {active === 2 && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                        />
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActive(3)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 relative ${
                        active === 3
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                    <AiFillCalendar size={20} />
                    <span>Events</span>
                    {active === 3 && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                        />
                    )}
                </motion.button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                >
                    {active === 1 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {products &&
                                products.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="group relative flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-gray-100/50 hover:border-blue-500/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex-grow">
                                            <ProductCard data={product} isShop={true} />
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}

                    {active === 2 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {allReviews &&
                                allReviews.map((review, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-gray-100/50 hover:border-blue-500/20 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.user.avatar}
                                                alt={review.user.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {review.user.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <AiFillStar size={16} />
                                                        <span className="text-gray-600 font-medium">
                                                            {review.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                                    {review.comment}
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            {(!allReviews || allReviews.length === 0) && (
                                <motion.div
                                    variants={itemVariants}
                                    className="text-center py-12 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/50"
                                >
                                    <div className="text-gray-400 mb-4">
                                        <AiFillStar size={48} className="mx-auto" />
                                    </div>
                                    <h5 className="text-lg text-gray-600 font-medium">
                                        No reviews available for this shop!
                                    </h5>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {active === 3 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {events &&
                                events.map((event, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-100/50 hover:border-blue-500/20 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <img
                                                src={event.images && event.images[0] ? (event.images[0].url || event.images[0]) : "https://via.placeholder.com/400x300?text=No+Image"}
                                                alt={event.name}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                }}
                                            />
                                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {event.discountPercent}% OFF
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {event.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {event.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    <AiFillCalendar className="inline-block mr-1" />
                                                    {new Date(event.startDate).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Ends:{" "}
                                                    {new Date(event.endDate).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            {(!events || events.length === 0) && (
                                <motion.div
                                    variants={itemVariants}
                                    className="text-center py-12 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/50 col-span-full"
                                >
                                    <div className="text-gray-400 mb-4">
                                        <AiFillCalendar size={48} className="mx-auto" />
                                    </div>
                                    <h5 className="text-lg text-gray-600 font-medium">
                                        No events available for this shop!
                                    </h5>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ShopProfileData;