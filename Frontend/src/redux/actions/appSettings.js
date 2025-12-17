import axios from "axios";
import { server } from "../../server";

// Get app settings
export const getAppSettings = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAppSettingsRequest",
    });

    const { data } = await axios.get(`${server}/settings/config`);

    dispatch({
      type: "getAppSettingsSuccess",
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: "getAppSettingsFailed",
      payload: error.response.data.message,
    });
  }
}; 