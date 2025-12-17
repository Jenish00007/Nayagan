import React from 'react';
import { AiOutlineEye, AiOutlineClose } from 'react-icons/ai';

// Add a currency formatter function at the top
const formatIndianCurrency = (amount) => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const OrderPreviewModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Calculate total items if cart exists
  const totalItems = order.cart ? order.cart.reduce((acc, item) => acc + (item.quantity || 0), 0) : (order.itemsQty || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-white/20">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AiOutlineEye className="text-white" size={24} />
                </div>
                Order Details
              </h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white focus:outline-none transition-all duration-200 p-2 hover:bg-white/20 rounded-xl"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-3xl font-bold text-gray-900 leading-tight">Order #{order._id?.slice(-6) || order.id?.slice(-6)}</h4>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-semibold text-sm shadow-sm">
                    {order.status}
                  </div>
                </div>

                <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Total Items:</span>
                    <span className="text-gray-800 font-semibold">{order.cart.length} items</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Total Amount:</span>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                      <span className="text-xl font-bold">{formatIndianCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Order Date:</span>
                    <span className="text-gray-800 font-semibold">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {order.createdAt && (
                        <>
                          <br />
                          <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 font-medium">Payment Status:</span>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                      {order.paymentInfo?.status || 'Paid'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-6">
                <h5 className="text-xl font-bold text-gray-900">Customer Information</h5>
                <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-800 font-semibold">{order.user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-800 font-semibold">{order.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-800 font-semibold">{order.user?.phoneNumber}</span>
                  </div>
                </div>

                <h5 className="text-xl font-bold text-gray-900">Shipping Address</h5>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {order.shippingAddress?.address1}, {order.shippingAddress?.address2}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                    {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details Section - now full width */}
            {order.cart && order.cart.length > 0 && (
              <div className="mt-10 w-full">
                <h5 className="text-xl font-bold text-gray-900 mb-2">Products</h5>
                <div className="flex items-center text-gray-700 mb-4 text-sm">
                  <span className="mr-6 font-medium">Total Unique Products: <span className="font-bold">{order.cart.length}</span></span>
                  <span className="font-medium">Total Quantity: <span className="font-bold">{order.cart.reduce((acc, item) => acc + (item.quantity || 0), 0)}</span></span>
                </div>
                <div className="divide-y rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 w-full">
                  {order.cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 w-full">
                      <img
                        src={item.images?.[0] || item.image || '/no-image.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="flex flex-col items-end min-w-[120px]">
                        <span className="text-gray-700 text-sm">Unit Price:</span>
                        <span className="font-semibold text-gray-800">{formatIndianCurrency(item.price)}</span>
                      </div>
                      <div className="flex flex-col items-end min-w-[120px]">
                        <span className="text-gray-700 text-sm">Subtotal:</span>
                        <span className="font-semibold text-gray-800">{formatIndianCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-base font-semibold text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
              onClick={onClose}
            >
              <AiOutlineClose size={18} />
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewModal; 