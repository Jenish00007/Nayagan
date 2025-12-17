import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  appName: "",
  logo: "",
};

export const appSettingsReducer = createReducer(initialState, {
  getAppSettingsRequest: (state) => {
    state.isLoading = true;
  },
  getAppSettingsSuccess: (state, action) => {
    state.isLoading = false;
    state.appName = action.payload.appName;
    state.logo = action.payload.logo;
  },
  getAppSettingsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
}); 