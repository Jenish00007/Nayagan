import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

// get all categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllCategoriesRequest",
    });

    console.log('Fetching categories from:', `${server}/categories`);
    const { data } = await axios.get(`${server}/categories`);
    console.log('Categories response:', data);

    if (!data.data) {
      throw new Error('No categories data received from server');
    }

    dispatch({
      type: "getAllCategoriesSuccess",
      payload: data.data,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error(error.response?.data?.error || "Failed to fetch categories");
    dispatch({
      type: "getAllCategoriesFailed",
      payload: error.response?.data?.error || "Failed to fetch categories",
    });
  }
}; 