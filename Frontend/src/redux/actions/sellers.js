import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    console.log('Fetching sellers...');
    dispatch({
      type: "getAllSellersRequest",
    });

    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');

    const { data } = await axios.get(`${server}/admin/sellers`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Sellers data received:', data);
    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    console.error('Error fetching sellers:', error.response || error);
    dispatch({
      type: "getAllSellerFailed",
      payload: error.response?.data?.message || "Failed to fetch sellers",
    });
  }
};
