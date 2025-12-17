import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { 
    AiOutlineShoppingCart, 
    AiOutlineCreditCard, 
    AiOutlineBank, 
    AiOutlineWallet,
    AiOutlineCheckCircle,
    AiOutlineLoading3Quarters
} from "react-icons/ai";
import { 
    FaCreditCard, 
    FaMoneyBillWave, 
    FaShieldAlt,
    FaLock
} from "react-icons/fa";

const Payment = () => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("razorpay");
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Set up axios interceptor to automatically add token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // Add request interceptor
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on component unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    useEffect(() => {
        try {
            const savedOrderData = JSON.parse(localStorage.getItem("latestOrder"));
            if (!savedOrderData) {
                toast.error("No order data found. Please try again.");
                navigate("/checkout");
                return;
            }
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            console.log('Payment component - Token from localStorage:', token ? 'Token exists' : 'No token');
            
            if (!token) {
                toast.error("Please login to continue");
                navigate("/login");
                return;
            }
            
            // Check if user data is available
            console.log('Payment component - User data:', user);
            if (!user) {
                toast.error("User data not found. Please login again.");
                navigate("/login");
                return;
            }
            
            setOrderData(savedOrderData);
        } catch (error) {
            console.error("Error loading order data:", error);
            toast.error("Error loading order data. Please try again.");
            navigate("/checkout");
        }
    }, [navigate, user]);

    if (!orderData) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
                    <p className="text-gray-600 mt-2">Please wait while we load your order details.</p>
                </div>
            </div>
        );
    }

    const order = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user && user,
        totalPrice: orderData?.totalPrice,
    };

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);
            
            const paymentData = {
                amount: orderData?.totalPrice,
                email: user?.email,
                name: user?.name,
                contact: user?.phoneNumber
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };

            const { data } = await axios.post(
                `${server}/payment/process`,
                paymentData,
                config
            );

            if (data.success && data.paymentLink) {
                // Open Razorpay payment link in new window
                window.open(data.paymentLink, '_blank');
                
                // For demo purposes, we'll simulate successful payment
                // In production, you'd handle the callback from Razorpay
                setTimeout(async () => {
                    await createOrder("Razorpay");
                }, 2000);
            } else {
                toast.error("Failed to create payment link");
            }
        } catch (error) {
            console.error("Razorpay payment error:", error);
            toast.error(error.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (paymentType) => {
        try {
            setLoading(true);
            
            const orderPayload = {
                cart: orderData?.cart,
                shippingAddress: orderData?.shippingAddress,
                user: user && user,
                totalPrice: orderData?.totalPrice,
                paymentInfo: {
                    type: paymentType,
                    status: "succeeded",
                },
            };

            console.log("Creating order with data:", orderPayload);
            console.log("Order endpoint:", `${server}/order/create-order`);
            console.log("User:", user);

            const response = await axios.post(`${server}/order/create-order`, orderPayload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            
            console.log("Order creation response:", response.data);
            
            navigate("/order/success");
            toast.success("Order successful!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            window.location.reload();
        } catch (error) {
            console.error("Order creation error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error("Please login to continue");
                navigate("/login");
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || "Invalid order data");
            } else if (error.response?.status === 500) {
                toast.error("Server error. Please try again later.");
            } else if (error.code === "NETWORK_ERROR") {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error(error.response?.data?.message || "Error creating order. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const cashOnDeliveryHandler = async () => {
        await createOrder("Cash On Delivery");
    };

    const PaymentMethodCard = ({ 
        icon, 
        title, 
        description, 
        value, 
        selected, 
        onClick, 
        disabled = false 
    }) => (
        <div 
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={disabled ? undefined : onClick}
        >
            {selected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <AiOutlineCheckCircle size={16} />
                </div>
            )}
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                    selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Processing payment...</p>
                        <p className="text-sm text-gray-500 mt-2">Please don't close this window</p>
                    </div>
                </div>
            )}
            
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
                    <p className="text-gray-600">Complete your purchase securely</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center mb-6">
                                <AiOutlineCreditCard className="text-2xl text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Choose Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                <PaymentMethodCard
                                    icon={<FaCreditCard size={24} />}
                                    title="Pay with Razorpay"
                                    description="Secure online payment with cards, UPI, net banking"
                                    value="razorpay"
                                    selected={selectedPayment === "razorpay"}
                                    onClick={() => setSelectedPayment("razorpay")}
                                />

                                <PaymentMethodCard
                                    icon={<FaMoneyBillWave size={24} />}
                                    title="Cash on Delivery"
                                    description="Pay when you receive your order"
                                    value="cod"
                                    selected={selectedPayment === "cod"}
                                    onClick={() => setSelectedPayment("cod")}
                                />
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <FaShieldAlt className="text-green-600 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-green-900">Secure Payment</h4>
                                        <p className="text-sm text-green-700">
                                            Your payment information is encrypted and secure
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <div className="mt-6">
                                <button
                                    onClick={selectedPayment === "razorpay" ? handleRazorpayPayment : cashOnDeliveryHandler}
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        `Pay ₹${orderData?.totalPrice}`
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                            <div className="flex items-center mb-6">
                                <AiOutlineShoppingCart className="text-2xl text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{orderData?.subTotalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">₹{orderData?.shipping}</span>
                                </div>
                                {orderData?.discountPrice > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{orderData?.discountPrice}</span>
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>₹{orderData?.totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Items:</span> {orderData?.cart?.length} products
                                    </div>
                                    <div>
                                        <span className="font-medium">Payment:</span> {selectedPayment === "razorpay" ? "Online" : "Cash on Delivery"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;