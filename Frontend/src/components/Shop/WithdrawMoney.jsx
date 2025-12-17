import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { FaMoneyBillWave } from "react-icons/fa";
import { BsCurrencyRupee } from "react-icons/bs";

// Custom toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    background: "#fff",
    color: "#333",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully! 🎉", {
          ...toastConfig,
          icon: "✅",
        });
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Something went wrong!", {
          ...toastConfig,
          icon: "❌",
        });
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully! 🗑️", {
          ...toastConfig,
          icon: "✅",
        });
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error("Failed to delete withdraw method!", {
          ...toastConfig,
          icon: "❌",
        });
      });
  };

  const error = () => {
    toast.error("You don't have enough balance to withdraw! 💸", {
      ...toastConfig,
      icon: "⚠️",
    });
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error(`You can't withdraw ₹${withdrawAmount}! Minimum amount is ₹50`, {
        ...toastConfig,
        icon: "⚠️",
      });
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(`Withdraw request of ₹${amount} is successful! 💰`, {
            ...toastConfig,
            icon: "✅",
          });
        })
        .catch((error) => {
          toast.error("Failed to process withdraw request!", {
            ...toastConfig,
            icon: "❌",
          });
        });
    }
  };

  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className="w-full min-h-[90vh] p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                  <FaMoneyBillWave className="text-4xl text-white filter drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow-lg"></div>
              </div>
              <div>
                <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                  Withdraw Money
                </div>
                <div className="text-gray-600 text-lg mt-2 font-medium">
                  Manage your earnings with ease
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full min-h-[70vh] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>

          <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl shadow-sm border border-indigo-200">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-md">
                  <FaMoneyBillWave className="text-2xl text-white" />
                </div>
                <div>
                  <h5 className="text-lg font-medium text-gray-600">Available Balance</h5>
                  <div className="flex items-center mt-1">
                    <BsCurrencyRupee className="text-2xl text-indigo-600" />
                    <span className="text-3xl font-bold text-indigo-600">{availableBalance}</span>
                  </div>
                </div>
              </div>
              
              <button
                className={`group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  availableBalance < 50 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
              >
                <span className="relative z-10 font-semibold">Withdraw Money</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`w-[95%] 800px:w-[50%] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl ${
            paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
          } min-h-[40vh] p-8 relative`}>
            <div className="w-full flex justify-end mb-6">
              <button
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <RxCross1
                  size={24}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                />
              </button>
            </div>
            
            {paymentMethod ? (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Add New Withdraw Method
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter your Bank name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank Country"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your Bank Swift Code"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter your bank Holder name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter your bank address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Add Withdraw Method
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Withdraw Money
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Amount to Withdraw
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BsCurrencyRupee className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={withdrawHandler}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
