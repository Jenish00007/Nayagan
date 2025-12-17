import React from "react";
import {
    AiFillFacebook,
    AiFillInstagram,
    AiFillYoutube,
    AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    footercompanyLinks,
    footerProductLinks,
    footerSupportLinks,
} from "../../static/data";

const Footer = () => {
    const { appName, logo } = useSelector((state) => state.appSettings);

    return (
        <footer className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-teal-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-400 rounded-full blur-xl"></div>
            </div>

            {/* Top border accent */}
            <div className="h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-8 py-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 text-center sm:text-left">
                        <div className="flex flex-col items-center sm:items-start mb-6">
                            <div className="relative group">
                                <img
                                    src={logo}
                                    alt={appName}
                                    className="w-32 h-14 object-contain bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105"
                                />
                            </div>
                            <h1 className="text-2xl font-bold mt-3 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                                {appName}
                            </h1>
                        </div>
                        
                        <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs">
                            Your one-stop shop for fresh groceries and daily essentials, 
                            delivered to your door with care and convenience.
                        </p>
                        
                        {/* Social Media Icons */}
                        <div className="flex justify-center sm:justify-start gap-4">
                            {[
                                { Icon: AiFillFacebook, color: "hover:text-blue-500", bg: "hover:bg-blue-500/20" },
                                { Icon: AiOutlineTwitter, color: "hover:text-sky-400", bg: "hover:bg-sky-400/20" },
                                { Icon: AiFillInstagram, color: "hover:text-pink-500", bg: "hover:bg-pink-500/20" },
                                { Icon: AiFillYoutube, color: "hover:text-red-500", bg: "hover:bg-red-500/20" }
                            ].map(({ Icon, color, bg }, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-full bg-white/5 border border-white/10 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${bg} ${color} backdrop-blur-sm`}
                                >
                                    <Icon size={20} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Company
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-400 to-transparent"></div>
                        </h3>
                        <ul className="space-y-3">
                            {footerProductLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        className="text-gray-400 hover:text-teal-400 transition-all duration-300 text-sm leading-6 hover:translate-x-2 inline-block relative group"
                                        to={link.link || "#"}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <div className="absolute inset-0 bg-teal-400/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop Links */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Shop
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                        </h3>
                        <ul className="space-y-3">
                            {footercompanyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm leading-6 hover:translate-x-2 inline-block relative group"
                                        to={link.link || "#"}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <div className="absolute inset-0 bg-blue-400/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Support
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
                        </h3>
                        <ul className="space-y-3">
                            {footerSupportLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm leading-6 hover:translate-x-2 inline-block relative group"
                                        to={link.link || "#"}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <div className="absolute inset-0 bg-purple-400/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm relative z-[60]" style={{zIndex:60, position:'relative'}}>
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-6 text-gray-400 text-sm">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                            <span className="flex items-center gap-2">
                                © {new Date().getFullYear()} {" "}
                                <span className="text-white font-medium">{appName}</span>
                                . All rights reserved.
                            </span>
                            <div className="flex gap-6">
                                <Link 
                                    to="/terms" 
                                    className="hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                                >
                                    Terms
                                </Link>
                                <Link 
                                    to="/privacy" 
                                    className="hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                                >
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                        
                        {/* Back to top button */}
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white text-xs font-medium rounded-full hover:from-teal-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl relative z-[70]"
                            style={{zIndex:70, position:'relative'}}
                        >
                            Back to Top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;