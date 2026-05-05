import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ILoginData {
    email: string;
    password: string;
}

interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface IResponse {
    token: string;
    user: IUser;
}

export const thunkAuthLogin = createAsyncThunk<IResponse, ILoginData>(
    "auth/thunkAuthLogin",
    async (data: ILoginData, thunkAPI) => {
        try {
            // Add Authorization header if a token already exists (e.g. refresh scenario)
            const existingToken = localStorage.getItem("token");
            const headers = existingToken
                ? { Authorization: `Bearer ${existingToken}` }
                : {};

            const response = await axios.post<IResponse>(
                `${import.meta.env.VITE_API_URL}users/login`,
                data,
                { headers }
            );

            const { token, user } = response.data;

            // Persist token and user to localStorage right after login
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { token, user };

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