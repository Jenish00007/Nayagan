import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import axios from "axios";
import { server } from "../../../server";
import { AiOutlineShoppingCart, AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import Typewriter from './Typewriter';

const Hero = () => {
    const [banner, setBanner] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSecondLine, setShowSecondLine] = useState(false);
    const [restartAnimation, setRestartAnimation] = useState(0);

    useEffect(() => {
        const fetchConfiguration = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${server}/settings/config`);
                if (data?.data?.banner) {
                    setBanner(data.data.banner);
                } else {
                    setError("No banner URL found in configuration");
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
                setError("Failed to load banner");
            } finally {
                setLoading(false);
            }
        };
        fetchConfiguration();
    }, []);

    const handleFirstLineComplete = () => {
        // Start the second line after a short delay
        setTimeout(() => {
            setShowSecondLine(true);
        }, 500);
    };

    const restartTypingAnimation = () => {
        setShowSecondLine(false);
        setRestartAnimation(prev => prev + 1);
    };

    // Optional: Restart animation every 10 seconds for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            restartTypingAnimation();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative min-h-[85vh] w-full bg-no-repeat flex items-center"
            style={{
                backgroundImage: banner ? `url(${banner})` : 'none',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f5f5f5"
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>

            <div className="relative z-10 w-[90%] 800px:w-[60%] mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-[28px] leading-[1.2] sm:text-[40px] md:text-[50px] lg:text-[60px] 800px:text-[70px] font-[700] capitalize text-white drop-shadow-lg">
                        <Typewriter 
                            text="Fresh Groceries"
                            speed={150}
                            delay={500}
                            onComplete={handleFirstLineComplete}
                            restart={restartAnimation}
                        />
                        <br /> 
                        {showSecondLine && (
                            <motion.span 
                                className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typewriter 
                                    text="Delivered to Your Door"
                                    speed={100}
                                    delay={0}
                                    restart={restartAnimation}
                                />
                            </motion.span>
                        )}
                    </h1>

                    <motion.p 
                        className="pt-4 sm:pt-6 text-[14px] sm:text-[16px] md:text-[18px] font-[Poppins] font-[400] text-white/90 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.5 }}
                    >
                        Discover our wide selection of fresh fruits, vegetables, dairy products, and pantry essentials. 
                        Shop from the comfort of your home and get your groceries delivered right to your doorstep.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                        <Link to="/products" className="inline-block w-full sm:w-auto">
                            <motion.div 
                                className="group w-full"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button className="relative inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-4 overflow-hidden font-medium transition duration-300 ease-out rounded-full shadow-lg group bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-800 to-blue-900 group-hover:translate-x-0 ease">
                                        <AiOutlineShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </span>
                                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                        Shop Now
                                    </span>
                                    <span className="relative invisible">Shop Now</span>
                                </button>
                            </motion.div>
                        </Link>

                        <Link to="/categories" className="inline-block w-full sm:w-auto">
                            <motion.div 
                                className="group w-full"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button className="relative inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-4 overflow-hidden font-medium transition duration-300 ease-out rounded-full shadow-lg group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20">
                                    <span className="flex items-center gap-2">
                                        Explore Categories
                                        <AiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Features section */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
                        {[
                            { text: "Free Delivery", icon: "🚚" },
                            { text: "24/7 Support", icon: "💬" },
                            { text: "Fresh Products", icon: "✨" },
                            { text: "Secure Payment", icon: "🔒" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3"
                            >
                                <span className="text-xl sm:text-2xl">{feature.icon}</span>
                                <span className="text-xs sm:text-sm font-medium">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <p className="text-red-500 bg-white/90 px-4 py-2 rounded-lg">{error}</p>
                </div>
            )}
        </div>
    )
}

export default Hero