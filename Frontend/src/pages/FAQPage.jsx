import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const FAQPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeHeading={5} />
            <Faq />
            <Footer />
        </div>
    );
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tab) => {
        if (activeTab === tab) {
            setActiveTab(0);
        } else {
            setActiveTab(tab);
        }
    };

    const faqData = [
        {
            question: "What is your return policy?",
            answer: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item."
        },
        {
            question: "How do I track my order?",
            answer: "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday."
        },
        {
            question: "Can I change or cancel my order?",
            answer: "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only offer shipping within the United States."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept visa, mastercard, paypal payment method also we have cash on delivery system."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <HiOutlineQuestionMarkCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Find answers to common questions about our products, shipping, returns, and more.
                </p>
            </div>

            <div className="space-y-4">
                {faqData.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <button
                            className="flex items-center justify-between w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                            onClick={() => toggleTab(index + 1)}
                        >
                            <span className="text-lg font-medium text-gray-900">
                                {faq.question}
                            </span>
                            {activeTab === index + 1 ? (
                                <BsChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <BsChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                        <AnimatePresence>
                            {activeTab === index + 1 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6">
                                        <p className="text-base text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-600">
                    Still have questions?{" "}
                    <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                        Contact our support team
                    </a>
                </p>
            </div>
        </div>
    );
};

export default FAQPage;