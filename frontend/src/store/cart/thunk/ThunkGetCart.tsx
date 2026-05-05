import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from '../../store'
import axios from "axios";

const FetchCart = createAsyncThunk(
    "cart/FetchCart",
    async (_, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const cartItems = Object.keys(state.cart.items);

        if (cartItems.length === 0) return [];

        const query = cartItems.map((id) => `id=${id}`).join('&');

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}products/listproducts?${query}`);
            const data = response.data.data || [];
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('FetchCart error:', error.response?.data || error.message);
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            console.error('FetchCart unexpected error:', error);
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

export default FetchCart