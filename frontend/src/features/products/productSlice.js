import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: null,
};

//Bringing products to the Async Thunk system via the Axios library.
export const productsFatching = createAsyncThunk(
  "products/productsFatching",
  async () => {
    const res = await axios.get(
      "http://localhost:5000/products"
    );
    return res.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/productsFatchingById",
  async (id) => {
    const res = await axios.get(`http://localhost:5000/product/${id}`);
    return res.data;

  }
);

// Some case for products slice
export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  // Need extra reducers for promise type functions
  extraReducers: (builder) => {
    builder.addCase(productsFatching.pending, (state, action) => {
      state.status = "pending";
    });

    builder.addCase(productsFatching.fulfilled, (state, action) => {
      state.status = "success";
      state.items = action.payload;
    });

    builder.addCase(productsFatching.rejected, (state, action) => {
      state.status = "rejected";
    });
  },
});

export default productsSlice.reducer;
// export const allProducts = (state) => state.items;
// export const singleProduct = (state) => state.items;