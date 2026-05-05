import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface IRegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface IRegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export const thunkAuthRegister = createAsyncThunk<IRegisterResponse, IRegisterData>(
    "auth/thunkAuthRegister",
    async (data: IRegisterData, thunkAPI) => {
        try {
            const response = await axios.post<IRegisterResponse>(
                `${import.meta.env.VITE_API_URL}users/register`,
                data
            );

            return response.data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Extract server-side error message if available
                const serverMessage =
                    error.response?.data?.message ||
                    error.response?.data?.msg ||
                    error.response?.data?.error ||
                    error.message;

                return thunkAPI.rejectWithValue(serverMessage as string);
            }
            return thunkAPI.rejectWithValue("An unexpected error occurred");
        }
    }
);