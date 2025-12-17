import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';

const DeliveryManManagement = () => {
    const [deliverymen, setDeliverymen] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");

    useEffect(() => {
        fetchDeliverymen();
    }, []);

    const fetchDeliverymen = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${server}/api/v2/deliveryman/all`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setDeliverymen(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching delivery men');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (deliverymanId) => {
        try {
            await axios.put(
                `${server}/api/v2/deliveryman/approve/${deliverymanId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            toast.success('Delivery man approved successfully');
            fetchDeliverymen();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error approving delivery man');
        }
    };

    const handleReject = async (deliverymanId) => {
        if (window.confirm('Are you sure you want to reject this delivery man?')) {
            try {
                await axios.delete(
                    `${server}/api/v2/deliveryman/reject/${deliverymanId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                toast.success('Delivery man rejected successfully');
                fetchDeliverymen();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error rejecting delivery man');
            }
        }
    };

    // Filtering logic
    const filteredDeliverymen = deliverymen.filter((deliveryman) => {
        const name = `${deliveryman.firstName || ''} ${deliveryman.lastName || ''}`.toLowerCase();
        const email = String(deliveryman.email || '').toLowerCase();
        const phone = String(deliveryman.phone || '').toLowerCase();
        const type = String(deliveryman.deliverymanType || '').toLowerCase();
        const zone = String(deliveryman.zone || '').toLowerCase();
        const vehicle = String(deliveryman.vehicle || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            name.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            type.includes(search) ||
            zone.includes(search) ||
            vehicle.includes(search);
        const regDate = new Date(deliveryman.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const matchesDate = !start || regDate >= start;
        return matchesSearch && matchesDate;
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Delivery Man Management</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 sm:flex-none">
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, type, zone, vehicle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        </span>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        />
                    </div>
                </div>
                {(searchTerm || startDate) && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setStartDate("");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Clear filters
                    </button>
                )}
            </div>
            <div className="text-sm text-gray-500 mb-4">
                {filteredDeliverymen.length} delivery men
                {(searchTerm || startDate) && (
                    <span className="ml-2 text-blue-600 font-medium">
                        (Filtered from {deliverymen.length} total)
                    </span>
                )}
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : filteredDeliverymen.length === 0 ? (
                <div className="w-full h-[200px] flex items-center justify-center bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <svg className="mx-auto text-gray-400" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <p className="mt-4 text-gray-600">
                            {searchTerm || startDate ? "No delivery men match your filters" : "No delivery men found"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeliverymen.map((deliveryman) => (
                        <div key={deliveryman._id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={deliveryman.deliverymanImage}
                                    alt={deliveryman.firstName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {deliveryman.firstName} {deliveryman.lastName}
                                    </h2>
                                    <p className="text-gray-600">{deliveryman.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <p><span className="font-semibold">Type:</span> {deliveryman.deliverymanType}</p>
                                <p><span className="font-semibold">Zone:</span> {deliveryman.zone}</p>
                                <p><span className="font-semibold">Vehicle:</span> {deliveryman.vehicle}</p>
                                <p><span className="font-semibold">Phone:</span> {deliveryman.phone}</p>
                                <p><span className="font-semibold">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded ${
                                        deliveryman.isApproved 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {deliveryman.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </p>
                                <p><span className="font-semibold">Registered:</span> {deliveryman.createdAt ? new Date(deliveryman.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                            </div>
                            <div className="flex space-x-2">
                                {!deliveryman.isApproved && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(deliveryman._id)}
                                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(deliveryman._id)}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Identity Document</h3>
                                <img
                                    src={deliveryman.identityImage}
                                    alt="Identity Document"
                                    className="w-full h-32 object-cover rounded"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryManManagement; 