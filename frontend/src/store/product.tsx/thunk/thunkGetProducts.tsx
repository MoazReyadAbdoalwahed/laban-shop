import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { Product } from '../../../types/product';

type ProductsResponse = Product[];

type SingleProductResponse = Product | null;

const FetchProducts = createAsyncThunk(
    "products/FetchProducts",
    async (catPrefix: string | null, thunkAPI) => {
        try {
            const categoryParam = catPrefix && catPrefix.trim() !== '' ? catPrefix : '';
            const response = await axios.get<{ status: string; data: ProductsResponse }>(
                `${import.meta.env.VITE_API_URL}products/listproducts?cat_prefix=${categoryParam}`
            );
            return response.data?.data || [];
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
            }
            return thunkAPI.rejectWithValue("An unexpected error occurred");
        }
    }
);

export const FetchSingleProduct = createAsyncThunk(
    "products/FetchSingleProduct",
    async (productId: string, thunkAPI) => {
        try {
            const response = await axios.get<{ status: string; data: SingleProductResponse | SingleProductResponse[] }>(
                `${import.meta.env.VITE_API_URL}products/listproducts?id=${productId}`
            );

            const data = response.data?.data;

            // Handle both array response and single object response
            if (Array.isArray(data)) {
                const product = data[0] || null;
                return product;
            }

            return data || null;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
            }
            return thunkAPI.rejectWithValue("An unexpected error occurred");
        }
    }
);

export default FetchProducts;

