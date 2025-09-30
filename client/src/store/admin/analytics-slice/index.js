import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  analyticsData: null,
  isLoading: false,
  error: null,
};

export const getAdminAnalytics = createAsyncThunk(
  "/analytics/getAdminAnalytics",
  async (timeRange = '30') => {
    const response = await axios.get(
      `${url}/admin/analytics?timeRange=${timeRange}`
    );

    return response.data;
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analyticsData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analyticsData = action.payload.data;
        state.error = null;
      })
      .addCase(getAdminAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.analyticsData = null;
        state.error = action.error.message;
      });
  },
});

export const { clearAnalytics } = adminAnalyticsSlice.actions;

export default adminAnalyticsSlice.reducer;
