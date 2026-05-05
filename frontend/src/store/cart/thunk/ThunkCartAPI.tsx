import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from '../../store';

const API_URL = `${import.meta.env.VITE_API_URL}cart`;

const getAuthHeaders = (token: string | null) => {
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Sync local cart from backend ──
export const syncCartFromBackend = createAsyncThunk(
    "cart/syncCartFromBackend",
    async (_, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.auth.token;

        if (!token) return rejectWithValue("No authentication token");

        try {
            const response = await axios.get(`${API_URL}/getcartitems`, {
                headers: getAuthHeaders(token),
            });
            return response.data.cartData || {};
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to fetch cart");
        }
    }
);

// ── Add to cart on backend ──
export const addToCartAPI = createAsyncThunk(
    "cart/addToCartAPI",
    async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.auth.token;

        if (!token) return rejectWithValue("Please login to add items to cart");

        try {
            const response = await axios.post(
                `${API_URL}/addtocart`,
                { productId, quantity },
                { headers: getAuthHeaders(token) }
            );
            return { productId, quantity, cartData: response.data.cartData, message: response.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to add item to cart");
        }
    }
);

// ── Remove from cart on backend ──
export const removeFromCartAPI = createAsyncThunk(
    "cart/removeFromCartAPI",
    async (productId: string, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.auth.token;

        if (!token) return rejectWithValue("No authentication token");

        try {
            const response = await axios.post(
                `${API_URL}/removefromcart`,
                { productId },
                { headers: getAuthHeaders(token) }
            );
            return { productId, cartData: response.data.cartData, message: response.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to remove item from cart");
        }
    }
);

// ── Update cart item quantity on backend ──
export const updateCartItemAPI = createAsyncThunk(
    "cart/updateCartItemAPI",
    async ({ productId, quantity }: { productId: string; quantity: number }, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.auth.token;

        if (!token) return rejectWithValue("No authentication token");

        try {
            const response = await axios.post(
                `${API_URL}/updatecartitem`,
                { productId, quantity },
                { headers: getAuthHeaders(token) }
            );
            return { productId, quantity, cartData: response.data.cartData, message: response.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to update cart item");
        }
    }
);

// ── Clear cart on backend ──
export const clearCartAPI = createAsyncThunk(
    "cart/clearCartAPI",
    async (_, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.auth.token;

        if (!token) return rejectWithValue("No authentication token");

        try {
            const response = await axios.post(
                `${API_URL}/clearcart`,
                {},
                { headers: getAuthHeaders(token) }
            );
            return { cartData: response.data.cartData, message: response.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to clear cart");
        }
    }
);
