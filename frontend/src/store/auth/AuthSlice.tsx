import { createSlice } from "@reduxjs/toolkit";
import { thunkAuthRegister } from "./thunk/ThunkGetRegister";
import { thunkAuthLogin } from "./thunk/ThunkGetAuth";

interface IAuthSlice {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
    token: string | null;
    loading: "idle" | "succeeded" | "failed" | "pending";
    error: string | null;
}

// ── Hydrate from localStorage / sessionStorage on app start ───
function loadFromStorage(): Pick<IAuthSlice, "user" | "token"> {
    try {
        const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
        const user = localStorage.getItem("user") ?? sessionStorage.getItem("user");
        return {
            token: token ?? null,
            user: user ? JSON.parse(user) : null,
        };
    } catch {
        return { token: null, user: null };
    }
}

const { token, user } = loadFromStorage();

const initialState: IAuthSlice = {
    loading: "idle",
    error: null,
    user,
    token,
};

// ── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.loading = "idle";
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = "idle";
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Register ──────────────────────────────────────
            .addCase(thunkAuthRegister.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(thunkAuthRegister.fulfilled, (state) => {
                state.loading = "succeeded";
                state.error = null;
            })
            .addCase(thunkAuthRegister.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string | null;
            })

            // ── Login ─────────────────────────────────────────
            .addCase(thunkAuthLogin.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(thunkAuthLogin.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                // Persist to localStorage
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(thunkAuthLogin.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string | null;
            });
    },
});

export const { resetAuth, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;