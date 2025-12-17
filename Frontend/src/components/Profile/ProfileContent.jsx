import React, { useEffect, useState } from 'react'
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteUserAddress,
    loadUser,
    updatUserAddress,
    updateUserInformation,
} from "../../redux/actions/user";
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from "../../styles/styles";
import { Button } from "@mui/material";
import { RxCross1 } from 'react-icons/rx'
import { MdTrackChanges } from "react-icons/md";
import { toast } from "react-toastify";
import axios from 'axios';
import { getAllOrdersOfUser } from '../../redux/actions/order';

// Simple country and state data
const countries = [
    { name: "India", isoCode: "IN" },
    { name: "United States", isoCode: "US" },
    { name: "United Kingdom", isoCode: "GB" },
    { name: "Canada", isoCode: "CA" },
    { name: "Australia", isoCode: "AU" },
    { name: "Germany", isoCode: "DE" },
    { name: "France", isoCode: "FR" },
    { name: "Japan", isoCode: "JP" },
    { name: "China", isoCode: "CN" },
    { name: "Brazil", isoCode: "BR" }
];

const states = {
    IN: [
        { name: "Maharashtra", isoCode: "MH" },
        { name: "Delhi", isoCode: "DL" },
        { name: "Karnataka", isoCode: "KA" },
        { name: "Tamil Nadu", isoCode: "TN" },
        { name: "Telangana", isoCode: "TS" },
        { name: "Gujarat", isoCode: "GJ" },
        { name: "Uttar Pradesh", isoCode: "UP" },
        { name: "West Bengal", isoCode: "WB" }
    ],
    US: [
        { name: "California", isoCode: "CA" },
        { name: "New York", isoCode: "NY" },
        { name: "Texas", isoCode: "TX" },
        { name: "Florida", isoCode: "FL" }
    ],
    GB: [
        { name: "England", isoCode: "ENG" },
        { name: "Scotland", isoCode: "SCT" },
        { name: "Wales", isoCode: "WLS" }
    ]
};

const ProfileContent = ({ active }) => {
    const { user, error, successMessage } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);

    const dispatch = useDispatch();


    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch({ type: "clearMessages" });
        }
    }, [error, successMessage]);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(name, email, phoneNumber, password));
    }

    // Image update
    const handleImage = async (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        await axios
            .put(`${server}/user/update-avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            })
            .then((response) => {
                dispatch(loadUser());
                toast.success("avatar updated successfully!");
            })
            .catch((error) => {
                toast.error(error);
            });
    };


    return (
        <div className='w-full'>
            {/* Profile */}
            {
                active === 1 && (
                    <>
                        <div className="flex justify-center w-full">
                            <div className='relative'>
                                <img 
                                    src={user?.avatar ? `${backend_url}/${user.avatar}` : "https://avatar.iran.liara.run/public/boy"}
                                    className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                                    alt="profile img"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://avatar.iran.liara.run/public/boy";
                                    }}
                                />

                                <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] hover:bg-[#d8e0e6] transition-colors duration-200">
                                    <input 
                                        type="file"
                                        id="image"
                                        className="hidden"
                                        onChange={handleImage}
                                        accept="image/*"
                                    />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <AiOutlineCamera className="text-gray-600 hover:text-gray-800 transition-colors duration-200" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />

                        <div className='w-full px-5'>
                            <form onSubmit={handleSubmit} aria-required={true}>
                                <div className='w-full 800px:flex block pb-3'>

                                    <div className=' w-[100%] 800px:w-[50%]'>
                                        <label className='block pb-2'>Full Name</label>
                                        <input type="text"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className=' w-[100%] 800px:w-[50%]'>
                                        <label className='block pb-2'>Email Address</label>
                                        <input type="text"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="w-full 800px:flex block pb-3">
                                    <div className=" w-[100%] 800px:w-[50%]">
                                        <label className="block pb-2">Phone Number</label>
                                        <input
                                            type="number"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className=" w-[100%] 800px:w-[50%]">
                                        <label className="block pb-2">Enter your password</label>
                                        <input
                                            type="password"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                </div>
                                <input
                                    className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                                    required
                                    value="Update"
                                    type="submit"
                                />
                            </form>
                        </div>
                    </>
                )
            }

            {/* Odder  */}
            {
                active === 2 && (
                    <div>
                        <AllOrders />
                    </div>
                )
            }

            {/* Refund order */}
            {
                active === 3 && (
                    <div>
                        <AllRefundOrders />
                    </div>
                )
            }

            {/* Track order */}
            {active === 5 && (
                <div>
                    <TrackOrder />
                </div>
            )}

            {/* Change Password */}
            {active === 6 && (
                <div>
                    <ChangePassword />
                </div>
            )}

            {/* user Address */}
            {active === 7 && (
                <div>
                    <Address />
                </div>
            )}

        </div >
    )
}

// All orders
const AllOrders = () => {
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfUser());
    }, []);

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "createdAt",
            headerName: "Order Date",
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => {
                return new Date(params.getValue(params.id, "createdAt")).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        },
        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.itemsQty,
                total: "₹" + item.totalPrice.toFixed(2),
                status: item.status,
                createdAt: item.createdAt
            });
        });

    return (
        <>
            <div className='pl-8 pt-1'>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Items Qty
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Order Date
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {row.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            item.status === "Delivered" 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                        {item.itemsQty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                        {item.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                        <Link to={`/user/order/${item.id}`}>
                                            <Button>
                                                <AiOutlineArrowRight size={20} />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

// Refund page

const AllRefundOrders = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);


    const eligibleOrders = orders && orders.filter((item) => item.status === "Processing refund");

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: "createdAt",
            headerName: "Order Date",
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => {
                return new Date(params.getValue(params.id, "createdAt")).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    eligibleOrders &&
        eligibleOrders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.itemsQty,
                total: "₹" + item.totalPrice.toFixed(2),
                status: item.status,
                createdAt: item.createdAt
            });
        });

    return (
        <div className="pl-8 pt-1">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Items Qty
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Order Date
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {row.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === "Delivered" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.itemsQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    <Link to={`/user/order/${item.id}`}>
                                        <Button>
                                            <AiOutlineArrowRight size={20} />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Track order
const TrackOrder = () => {

    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);



    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: "createdAt",
            headerName: "Order Date",
            minWidth: 130,
            flex: 0.8,
            renderCell: (params) => {
                return new Date(params.getValue(params.id, "createdAt")).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/track/order/${params.id}`}>
                            <Button>
                                <MdTrackChanges size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.itemsQty,
                total: "₹" + item.totalPrice.toFixed(2),
                status: item.status,
                createdAt: item.createdAt
            });
        });

    return (
        <div className="pl-8 pt-1">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Items Qty
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Order Date
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {row.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === "Delivered" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.itemsQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {item.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                                    <Link to={`/user/track/order/${item.id}`}>
                                        <Button>
                                            <MdTrackChanges size={20} />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


// Payment method

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordChangeHandler = async (e) => {
        e.preventDefault();

        await axios
            .put(
                `${server}/user/update-user-password`,
                { oldPassword, newPassword, confirmPassword },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success("Pawword is updated");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className='w-full px-5'>
            <h1
                className='text-[25px] text-center font-[600] text[#000000ba] pb-2'
            >
                Change Password
            </h1>
            <div className='w-full'>
                <form
                    aria-required
                    onSubmit={passwordChangeHandler}
                    className="flex flex-col items-center"
                >
                    <div className=" w-[100%] 800px:w-[50%] mt-5">
                        <label className='block pb-2'>Enter your Old password</label>
                        <input type="password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className=" w-[100%] 800px:w-[50%] mt-2">
                        <label className='block pb-2'>Enter your new Password</label>
                        <input type="password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className=" w-[100%] 800px:w-[50%] mt-2">
                        <label className="block pb-2">Enter your confirm password</label>
                        <input
                            type="password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <input
                            className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                            required
                            value="Update"
                            type="submit"
                        />
                    </div>
                </form>

            </div>




        </div>

    )
}

// Address
const Address = () => {

    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState();
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [addressType, setAddressType] = useState("");
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();


    const addressTypeData = [
        {
            name: "Default",
        },
        {
            name: "Home",
        },
        {
            name: "Office",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (addressType === "" || country === "" || city === "") {
            toast.error("Please fill all the fields!");
        } else {
            // hear use redex
            dispatch(
                updatUserAddress(
                    country,
                    city,
                    address1,
                    address2,
                    zipCode,
                    addressType
                )
            );
            setOpen(false);
            setCountry("");
            setCity("");
            setAddress1("");
            setAddress2("");
            setZipCode(null); // return type is int so default is null
            setAddressType("");
        }
    }

    const handleDelete = (item) => {
        const id = item._id;
        dispatch(deleteUserAddress(id));
    }

    return (
        <div className='w-full px-5'>

            {
                open && (
                    <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
                        <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
                            <div className="w-full flex justify-end p-3">
                                <RxCross1
                                    size={30}
                                    className="cursor-pointer"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <h1 className="text-center text-[25px] font-Poppins">
                                Add New Address
                            </h1>
                            <div className='w-full'>
                                <form aria-required onSubmit={handleSubmit} className="w-full">
                                    <div className="w-full block p-4">
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Country</label>
                                            <select
                                                name=""
                                                id=""
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="w-[95%] border h-[40px] rounded-[5px]"
                                            >
                                                <option value=""
                                                    className='bloc border pb-2'
                                                >
                                                    Choose your contry
                                                </option>
                                                {
                                                    countries.map((item) => (
                                                        <option
                                                            className="block pb-2"
                                                            key={item.isoCode}
                                                            value={item.isoCode}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {/* City */}
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Choose your City</label>
                                            <select
                                                name=""
                                                id=""
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-[95%] border h-[40px] rounded-[5px]"
                                            >
                                                <option value="" className="block border pb-2">
                                                    choose your city
                                                </option>
                                                {states[country] &&
                                                    states[country].map((item) => (
                                                        <option
                                                            className="block pb-2"
                                                            key={item.isoCode}
                                                            value={item.isoCode}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {/* Address 1 */}
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Address 1</label>
                                            <input
                                                type="address"
                                                className={`${styles.input}`}
                                                required
                                                value={address1}
                                                onChange={(e) => setAddress1(e.target.value)}
                                            />
                                        </div>
                                        {/* Address 2 */}
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Address 2</label>
                                            <input
                                                type="address"
                                                className={`${styles.input}`}
                                                required
                                                value={address2}
                                                onChange={(e) => setAddress2(e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Zip Code</label>
                                            <input
                                                type="number"
                                                className={`${styles.input}`}
                                                required
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className='block pb-2'>Address Type</label>
                                            <select name="" id=""
                                                value={addressType}
                                                onChange={(e) => setAddressType(e.target.value)}
                                                className='w-[95%] border h-[40px]  rounded-[5px]'
                                            >
                                                <option value=""
                                                    className='block border pb-2'
                                                >
                                                    Choose Yoour Address Type
                                                </option>
                                                {
                                                    addressTypeData &&
                                                    addressTypeData.map((item) => (
                                                        <option
                                                            className='block pb-2'
                                                            key={item.name}
                                                            value={item.name}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className=" w-full pb-2">
                                            <input
                                                type="submit"
                                                className={`${styles.input} mt-5 cursor-pointer`}
                                                required
                                                readOnly
                                            />
                                        </div>

                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>
                )

            }

            <div className='flex w-full items-center justify-between' >
                <h1
                    className='text-[25px] font-[600] text[#000000ba] pb-2'
                >
                    My Address
                </h1>
                <div className={`${styles.button} rounded-md`}
                    onClick={() => setOpen(true)}
                >
                    <span className='text-[#fff]'>Add New</span>

                </div>
            </div>
            <br />

            {user &&
                user.addresses.map((item, index) => (
                    <div
                        className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
                        key={index}
                    >
                        <div className="flex items-center">
                            <h5 className="pl-5 font-[600]">{item.addressType}</h5>
                        </div>
                        <div className="pl-8 flex items-center">
                            <h6 className="text-[12px] 800px:text-[unset]">
                                {item.address1} {item.address2}
                            </h6>
                        </div>
                        <div className="pl-8 flex items-center">
                            <h6 className="text-[12px] 800px:text-[unset]">
                                {user && user.phoneNumber}
                            </h6>
                        </div>
                        <div className="min-w-[10%] flex items-center justify-between pl-8">
                            <AiOutlineDelete
                                size={25}
                                className="cursor-pointer"
                                onClick={() => handleDelete(item)}
                            />
                        </div>
                    </div>
                ))}

            {
                user && user.addresses.length === 0 && (
                    <h5 className="text-center pt-8 text-[18px]">
                        You not have any saved address!
                    </h5>
                )}
        </div>
    )

}


export default ProfileContent