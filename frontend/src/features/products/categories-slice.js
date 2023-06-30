import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductSt } from "./products-slice";
import { RootState } from "../app/store";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const res = await fetch(`http://localhost:5000/categories`);
    const json = await res.json();
    return json;
  }
);

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (id) => {
    const res = await fetch(`http://localhost:5000/category/${id}`);
    const json = await res.json();
    return json;
  }
);

const initialState = {
  categories: [],
  oneCategory: null,
  error: null,
  status: "idle",
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.oneCategory = action.payload;
        console.log(action.payload, "pay");
      });
  },
});

export default categoriesSlice.reducer;
export const getCategories = (state) => state.categories.categories;
export const getCategory = (state) => state.categories.oneCategory;
