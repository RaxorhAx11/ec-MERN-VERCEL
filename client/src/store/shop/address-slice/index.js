import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;


const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    try {
      console.log("Sending address data to server:", formData);
      console.log("Backend URL:", url);
      const response = await axios.post(
        `${url}/shop/address/add`,
        formData
      );
      console.log("Server response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
       `${url}/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${url}/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
     `${url}/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.addressList.push(action.payload.data);
        }
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          const index = state.addressList.findIndex(
            (address) => address._id === action.payload.data._id
          );
          if (index !== -1) {
            state.addressList[index] = action.payload.data;
          }
        }
      })
      .addCase(editaAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // The address will be removed from the list when fetchAllAddresses is called
        }
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default addressSlice.reducer;
