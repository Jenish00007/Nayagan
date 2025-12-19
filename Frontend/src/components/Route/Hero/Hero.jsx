import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import axios from "axios";
import { server } from "../../../server";
import { AiOutlineShoppingCart } from "react-icons/ai";
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
                    setError("No banner found");
                }
            } catch (error) {
                setError("Failed to load banner");
            } finally {
                setLoading(false);
            }
        };
        fetchConfiguration();
    }, []);

    const handleFirstLineComplete = () => {
        setTimeout(() => setShowSecondLine(true), 500);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setShowSecondLine(false);
            setRestartAnimation(prev => prev + 1);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative min-h-[85vh] w-full bg-no-repeat flex items-center"
            // style={{
            //     backgroundImage: banner ? `url(${banner})` : 'none',
            //     backgroundSize: "cover",
            //     backgroundPosition: "center",
            //     backgroundColor: "#000"
            // }}
        >
            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>

            <div className="relative z-10 w-[90%] 800px:w-[60%] mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* HERO TITLE */}
                    <h1 className="text-[28px] sm:text-[40px] md:text-[55px] lg:text-[65px] font-[800] text-white leading-tight drop-shadow-xl">
                        <Typewriter
                            text="THALAPATHY VIJAY"
                            speed={120}
                            delay={500}
                            onComplete={handleFirstLineComplete}
                            restart={restartAnimation}
                        />
                        <br />
                        {showSecondLine && (
                            <motion.span
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typewriter
                                    text="Fan Edition T-Shirts"
                                    speed={100}
                                    delay={0}
                                    restart={restartAnimation}
                                />
                            </motion.span>
                        )}
                    </h1>

                    {/* DESCRIPTION */}
                    <motion.p
                        className="pt-5 text-[14px] sm:text-[16px] md:text-[18px] text-white/90 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.5 }}
                    >
                        Celebrate the legacy of Thalapathy Vijay with premium fan-edition T-shirts.
                        Iconic designs, powerful quotes, and mass looks — made exclusively for true fans.
                    </motion.p>

                    {/* CTA BUTTON */}
                    <div className="flex gap-4 mt-8">
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full 
                                bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold 
                                shadow-xl hover:from-yellow-400 hover:to-orange-500 transition"
                            >
                                <AiOutlineShoppingCart size={22} />
                               Buy Now
                            </motion.button>
                        </Link>
                    </div>

                    {/* FAN FEATURES */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
                        {[
                            { text: "Fan Edition", icon: "🔥" },
                            { text: "Premium Cotton", icon: "👕" },
                            { text: "Limited Stock", icon: "⚡" },
                            { text: "All India Delivery", icon: "🚚" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm rounded-lg p-3"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-sm font-semibold">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Loader */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <p className="text-red-500 bg-white px-4 py-2 rounded-lg">{error}</p>
                </div>
            )}
        </div>
    )
}

export default Hero;
