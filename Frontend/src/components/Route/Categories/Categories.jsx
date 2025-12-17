import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/styles'
import axios from "axios";
import { server } from "../../../server";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 5 && autoScroll) {
            const interval = setInterval(() => {
                if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const scrollWidth = container.scrollWidth;
                    const clientWidth = container.clientWidth;
                    const currentScroll = container.scrollLeft;
                    
                    if (currentScroll >= scrollWidth - clientWidth) {
                        // Reset to beginning when reaching the end
                        container.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scroll to next set of categories
                        const nextScroll = currentScroll + (clientWidth * 0.8);
                        container.scrollTo({ left: nextScroll, behavior: 'smooth' });
                    }
                }
            }, 3000); // Auto-scroll every 3 seconds

            return () => clearInterval(interval);
        }
    }, [categories, autoScroll]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${server}/categories`);
            setCategories(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    const handleMouseEnter = () => {
        setAutoScroll(false);
    };

    const handleMouseLeave = () => {
        setAutoScroll(true);
    };

    const handleManualScroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            const newScrollLeft = direction === 'left' 
                ? container.scrollLeft - scrollAmount 
                : container.scrollLeft + scrollAmount;
            
            container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop by Categories</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Left Arrow */}
                        {categories.length > 5 && (
                            <button
                                onClick={() => handleManualScroll('left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Right Arrow */}
                        {categories.length > 5 && (
                            <button
                                onClick={() => handleManualScroll('right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        {/* Scrollable Container */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {categories.map((category) => {
                                const handleSubmit = () => {
                                    navigate(`/subcategories?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`);
                                }
                                return (
                                    <div
                                        className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center flex-shrink-0"
                                        style={{ minWidth: '200px', maxWidth: '200px' }}
                                        key={category._id}
                                        onClick={handleSubmit}
                                    >
                                        <div className="w-full aspect-square rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    alt={category.name}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 sm:p-4 text-center w-full">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Scroll Indicators */}
                        {categories.length > 5 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({ length: Math.ceil(categories.length / 5) }, (_, index) => (
                                    <div
                                        key={index}
                                        className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"
                                        style={{
                                            backgroundColor: scrollContainerRef.current && 
                                                scrollContainerRef.current.scrollLeft >= index * (scrollContainerRef.current.clientWidth * 0.8) &&
                                                scrollContainerRef.current.scrollLeft < (index + 1) * (scrollContainerRef.current.clientWidth * 0.8)
                                                ? '#3B82F6' : '#D1D5DB'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {!loading && categories.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-500 text-base sm:text-lg">No categories found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Categories