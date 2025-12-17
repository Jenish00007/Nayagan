import axios from "axios";
import { server } from "../../server";

// Get all delivery men
export const getAllDeliveryMen = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllDeliveryMenRequest",
    });

    const { data } = await axios.get(`${server}/deliveryman/all`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllDeliveryMenSuccess",
      payload: data.deliveryMen,
    });
  } catch (error) {
    dispatch({
      type: "getAllDeliveryMenFail",
      payload: error.response?.data?.message || "Error fetching delivery men",
    });
  }
};

// Approve delivery man
export const approveDeliveryMan = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "approveDeliveryManRequest",
    });

    const { data } = await axios.put(
      `${server}/deliveryman/approve/${id}`,
      {},
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "approveDeliveryManSuccess",
    });

    return data;
  } catch (error) {
    dispatch({
      type: "approveDeliveryManFail",
      payload: error.response?.data?.message || "Error approving delivery man",
    });
    throw error;
  }
};

// Reject delivery man
export const rejectDeliveryMan = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "rejectDeliveryManRequest",
    });

    const { data } = await axios.delete(
      `${server}/deliveryman/reject/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "rejectDeliveryManSuccess",
    });

    return data;
  } catch (error) {
    dispatch({
      type: "rejectDeliveryManFail",
      payload: error.response?.data?.message || "Error rejecting delivery man",
    });
    throw error;
  }
};

// Edit delivery man
export const editDeliveryMan = (id, formData) => async (dispatch) => {
  try {
    dispatch({
      type: "editDeliveryManRequest",
    });

    const { data } = await axios.put(
      `${server}/deliveryman/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: "editDeliveryManSuccess",
    });

    return data;
  } catch (error) {
    dispatch({
      type: "editDeliveryManFail",
      payload: error.response?.data?.message || "Error editing delivery man",
    });
    throw error;
  }
};

// Delete delivery man
export const deleteDeliveryMan = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteDeliveryManRequest",
    });

    const { data } = await axios.delete(
      `${server}/deliveryman/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteDeliveryManSuccess",
    });

    return data;
  } catch (error) {
    dispatch({
      type: "deleteDeliveryManFail",
      payload: error.response?.data?.message || "Error deleting delivery man",
    });
    throw error;
  }
}; 