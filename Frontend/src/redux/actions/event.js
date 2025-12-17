import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

// create event
export const createevent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/event/create-event`,
      newForm,
      config
    );
    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });
    toast.success("Event created successfully!");
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || "Failed to create event",
    });
    toast.error(error.response?.data?.message || "Failed to create event");
  }
};

// create event by admin
export const createAdminEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const config = { 
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      } 
    };

    const { data } = await axios.post(
      `${server}/event/admin-create-event`,
      newForm,
      config
    );

    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });
    toast.success("Event created successfully!");
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || "Failed to create event",
    });
    toast.error(error.response?.data?.message || "Failed to create event");
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFailed",
      payload: error.response.data.message,
    });
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || "Failed to fetch events",
    });
  }
};

// get all events for admin
export const getAllEventsAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${server}/event/admin-all-events`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    console.error("Error fetching admin events:", error.response || error);
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || "Failed to fetch events",
    });
  }
};
