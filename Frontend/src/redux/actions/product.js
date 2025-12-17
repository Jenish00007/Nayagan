import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config
    );
    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response.data.message,
    });
  }
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    console.log("Products data from API:", data.products); // Debug log
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const token = localStorage.getItem('token');
    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: {
        message: data.message,
        productId: id
      },
    });
    
    return { type: "deleteProductSuccess" };
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || "Error deleting product"
    });
    return { type: "deleteProductFailed" };
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};

// get all products for admin
export const getAllProductsAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${server}/admin/products`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.error('Error fetching products:', error.response || error);
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || "Failed to fetch products",
    });
  }
};

// update product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({
      type: "updateProductRequest",
    });

    const { data } = await axios.put(
      `${server}/product/update-product/${id}`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: "updateProductSuccess",
      payload: data.product,
    });

    return {
      type: "updateProductSuccess",
      payload: data.product,
    };
  } catch (error) {
    dispatch({
      type: "updateProductFailed",
      payload: error.response?.data?.message || "Error updating product",
    });
    throw error;
  }
};
