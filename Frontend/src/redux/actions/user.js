import axios from "axios";
import { server } from "../../server";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    
    const token = localStorage.getItem('token');
    console.log('loadUser: Token from localStorage:', token);

    if (!token) {
      dispatch({
        type: "LoadUserFail",
        payload: "No token found",
      });
      return;
    }

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('loadUser: User data received:', data);
    
    if (data.user) {
      dispatch({
        type: "LoadUserSuccess",
        payload: data.user,
      });
    } else {
      dispatch({
        type: "LoadUserFail",
        payload: "User data not found",
      });
    }
  } catch (error) {
    console.error('loadUser: Error occurred:', error);
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || "Failed to load user data",
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {

    dispatch({
      type: "LoadSellerRequest",
    });
    console.log('loadSeller: Starting request...', dispatch);
    const token = localStorage.getItem('token');
    console.log('loadSeller: Token from localStorage:', token);

    if (!token) {
      throw new Error('Authentication token is missing. Please log in.');
    }

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('loadSeller: Response received:', data);
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
    console.log('loadSeller: Success action dispatched');
  } catch (error) {
    console.error('loadSeller: Error occurred:', error);
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || "Failed to load seller data",
    });
  }
};

// User update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const token = localStorage.getItem('token');
      console.log('updateUserInformation: Token from localStorage:', token);

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          name,
          email,
          phoneNumber,
          password,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
      toast.success('Updated successfully');
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

// update user address
export const updatUserAddress = (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated succesfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${server}/admin/users`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.response || error);
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response?.data?.message || "Failed to fetch users",
    });
  }
};

// delete user --- admin
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserRequest",
    });

    const token = localStorage.getItem('token');
    await axios.delete(`${server}/user/delete-user/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    dispatch({
      type: "deleteUserSuccess",
    });
    
    toast.success("User deleted successfully!");
    dispatch(getAllUsers()); // Refresh the users list after deletion
  } catch (error) {
    dispatch({
      type: "deleteUserFailed",
      payload: error.response?.data?.message || "Failed to delete user",
    });
    toast.error(error.response?.data?.message || "Failed to delete user");
  }
};

// what is action in redux ?
// Trigger an event , and call reducer
// action is a plain object that contains information about an event that has occurred
// action is the only way to change the state in redux
// action is the only way to send data from the application to the store

// dispatch :- active action , (action trigger)
