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
            
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-pink-500 rounded-full blur-xl"></div>
            </div>

            {/* Accent line */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-pink-500"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-16">

                    {/* Brand */}
                    <div className="text-center sm:text-left">
                        <img
                            src={logo}
                            alt={appName}
                            className="w-32 h-14 object-contain bg-white/10 p-2 rounded-lg mb-4"
                        />

                        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                            {appName}
                        </h1>

                        <p className="text-gray-300 text-sm mt-4 max-w-xs">
                            Premium Fan Edition T-Shirts inspired by movies, stars,
                            and iconic moments. Wear your fandom with pride 🔥
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-4 mt-6 justify-center sm:justify-start">
                            {[AiFillFacebook, AiFillInstagram, AiFillYoutube].map(
                                (Icon, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 transition cursor-pointer"
                                    >
                                        <Icon size={20} />
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Collections */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Collections</h3>
                        <ul className="space-y-3">
                            {footerProductLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.link || "#"}
                                        className="text-gray-400 hover:text-red-400 text-sm transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fan Zone */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Fan Zone</h3>
                        <ul className="space-y-3">
                            {footercompanyLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.link || "#"}
                                        className="text-gray-400 hover:text-yellow-400 text-sm transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Support</h3>
                        <ul className="space-y-3">
                            {footerSupportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.link || "#"}
                                        className="text-gray-400 hover:text-pink-400 text-sm transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 bg-black/30">
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 text-gray-400 text-sm">
                        <span>
                            © {new Date().getFullYear()}{" "}
                            <span className="text-white font-medium">{appName}</span>
                            . All Fan Rights Reserved.
                        </span>

                        <button
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs hover:scale-105 transition"
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
