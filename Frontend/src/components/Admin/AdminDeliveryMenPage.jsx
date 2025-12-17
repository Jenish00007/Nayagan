import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeliveryMen, approveDeliveryMan, rejectDeliveryMan } from "../../redux/actions/deliveryman";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FaTruck, FaCheck, FaTimes, FaUserPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";
import Loader from "../Layout/Loader";

const AdminDeliveryMenPage = () => {
  const dispatch = useDispatch();
  const { deliveryMen, loading, error } = useSelector((state) => state.deliveryman);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    idProof: null,
    currentPhoto: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    dispatch(getAllDeliveryMen());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${server}/deliveryman/register`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Delivery man registered successfully!");
        setShowAddForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          vehicleType: "",
          vehicleNumber: "",
          licenseNumber: "",
          idProof: null,
          currentPhoto: null,
        });
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(data.message || "Error registering delivery man");
      }
    } catch (error) {
      toast.error("Error registering delivery man");
    }
  };

  const handleEdit = (deliveryMan) => {
    setSelectedDeliveryMan(deliveryMan);
    setFormData({
      name: deliveryMan.name,
      email: deliveryMan.email,
      phoneNumber: deliveryMan.phoneNumber,
      address: deliveryMan.address,
      vehicleType: deliveryMan.vehicleType,
      vehicleNumber: deliveryMan.vehicleNumber,
      licenseNumber: deliveryMan.licenseNumber,
      idProof: null,
      currentPhoto: deliveryMan.idProof,
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && key !== 'currentPhoto') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      console.log('Sending edit request for delivery man:', selectedDeliveryMan._id);
      const response = await axios.put(
        `${server}/deliveryman/edit/${selectedDeliveryMan._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log('Edit response:', response.data);

      if (response.data.success) {
        toast.success("Delivery man updated successfully!");
        setShowEditForm(false);
        setSelectedDeliveryMan(null);
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(response.data.message || "Error updating delivery man");
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error.response?.data?.message || "Error updating delivery man");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery man?")) {
      try {
        const response = await axios.delete(
          `${server}/deliveryman/delete/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Delivery man deleted successfully!");
          dispatch(getAllDeliveryMen());
        } else {
          toast.error(response.data.message || "Error deleting delivery man");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting delivery man");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${server}/deliveryman/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Delivery man approved successfully!");
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error approving delivery man");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this delivery man?")) {
      try {
        const response = await axios.delete(
          `${server}/deliveryman/reject/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Delivery man rejected successfully!");
          dispatch(getAllDeliveryMen());
        } else {
          toast.error(response.data.message || "Error rejecting delivery man");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error rejecting delivery man");
      }
    }
  };

  const handlePreview = async (id) => {
    try {
      const response = await axios.get(
        `${server}/admin/delivery-man/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPreviewData(response.data.deliveryMan);
        setShowPreviewModal(true);
      } else {
        toast.error(response.data.message || "Error fetching delivery man details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching delivery man details");
    }
  };

  const filteredDeliveryMen = (deliveryMen || []).filter((man) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (man.name?.toLowerCase().includes(search) || "") ||
      (man.email?.toLowerCase().includes(search) || "") ||
      (man.phoneNumber?.toLowerCase().includes(search) || "") ||
      (man.status?.toLowerCase().includes(search) || "") ||
      (man.vehicleType?.toLowerCase().includes(search) || "");

    const joinedDate = man.createdAt ? new Date(man.createdAt) : null;
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = (!start || (joinedDate && joinedDate >= start));

    return matchesSearch && matchesDate;
  });

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <FaTruck className="text-4xl text-white filter drop-shadow-lg" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                Delivery Men
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage and monitor all delivery personnel
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {deliveryMen?.length || 0} total delivery men
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>

        {/* Add Delivery Man Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <FaUserPlus className="text-xl" />
          <span>Add Delivery Man</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-[70vh] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="w-full relative z-10">
          {/* Filter/Search Bar */}
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search the delivery men here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white placeholder-white"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Man</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeliveryMen?.map((deliveryMan) => (
                    <tr key={deliveryMan._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-sm">
                              <FaTruck className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{deliveryMan.name}</div>
                            <div className="text-xs text-gray-500">{deliveryMan.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deliveryMan.phoneNumber}</div>
                        <div className="text-xs text-gray-500">{deliveryMan.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-gray-200">
                          {deliveryMan.vehicleType} - {deliveryMan.vehicleNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                            deliveryMan.isApproved
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                              : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {deliveryMan.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(deliveryMan._id)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="Preview"
                          >
                            <FaEye size={16} className="group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button
                            onClick={() => handleEdit(deliveryMan)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="Edit Delivery Man"
                          >
                            <FaEdit size={16} className="group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          {!deliveryMan.isApproved && (
                            <>
                              <button
                                onClick={() => handleApprove(deliveryMan._id)}
                                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                title="Approve Delivery Man"
                              >
                                <FaCheck size={16} className="group-hover:scale-110 transition-transform duration-200" />
                              </button>
                              <button
                                onClick={() => handleReject(deliveryMan._id)}
                                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                title="Reject Delivery Man"
                              >
                                <FaTimes size={16} className="group-hover:scale-110 transition-transform duration-200" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>

        {/* Add Delivery Man Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Delivery Man</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="bike">Bike</option>
                      <option value="scooter">Scooter</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600"
                  >
                    Add Delivery Man
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Delivery Man Modal */}
        {showEditForm && selectedDeliveryMan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Delivery Man</h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="bike">Bike</option>
                      <option value="scooter">Scooter</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
                    {formData.currentPhoto && (
                      <div className="mb-4">
                        <img
                          src={formData.currentPhoto}
                          alt="Current ID Proof"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Leave empty to keep current ID proof</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600"
                  >
                    Update Delivery Man
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Delivery Man Details</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{previewData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{previewData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{previewData.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{previewData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <p className="font-medium capitalize">{previewData.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Number</p>
                      <p className="font-medium">{previewData.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{previewData.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                {/* ID Proof */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Proof</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={previewData.idProof}
                      alt="ID Proof"
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Deliveries</p>
                      <p className="font-medium">{previewData.totalDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-medium">{previewData.rating.toFixed(1)} / 5.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          previewData.isApproved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {previewData.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          previewData.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {previewData.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDeliveryMenPage; 