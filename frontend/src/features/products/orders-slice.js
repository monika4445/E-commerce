import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../app/store';

const initialState = {
  status: 'idle',
  clientSecret: '',
  orders: [],
  error: null,
};

export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async ({ token, cartId, products }) => {
    try {
      const response = await axios.post('http://localhost:5000/createOrderPayment', {
        token,
        cartId,
        products,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  }
);

export const orderById = createAsyncThunk(
  'orders/orderById',
  async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/order/${id}`);
      console.log(response, 'r');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch order by ID');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPaymentIntent.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.clientSecret = payload;
        state.orders = payload.order;
      })
      .addCase(orderById.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.orders = payload;
      });
  },
});

export default orderSlice.reducer;
export const getOrders = (state) => state.orders.orders;
