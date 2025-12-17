import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { loadUser } from "../../redux/actions/user";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const { user } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [address, setAddress] = useState(user && user.address);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setAddress(user.address);
    }
  }, [user]);

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        dispatch(loadUser());
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          name,
          email,
          phoneNumber,
          address,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(loadUser());
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${server}/user/logout`, { withCredentials: true });
      dispatch({ type: "LOGOUT_SUCCESS" });
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-full bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="relative">
            <img
              src={user?.avatar || "https://avatar.iran.liara.run/public/boy"}
              alt=""
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-blue-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://avatar.iran.liara.run/public/boy";
              }}
            />
            <div className="w-[30px] h-[30px] bg-blue-500 rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
                accept="image/*"
                disabled={loading}
              />
              <label htmlFor="image" className="cursor-pointer">
                <AiOutlineCamera className="text-white" size={20} />
              </label>
            </div>
          </div>

          <form
            aria-required={true}
            className="flex flex-col items-center w-full max-w-2xl mt-8"
            onSubmit={updateHandler}
          >
            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-3 rounded-lg transition-colors duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="w-full max-w-2xl mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 