import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";
import { getTotalQuantity } from '../cart/selectors/Selectors'
import FetchCart from "./thunk/ThunkGetCart";
import { selectCartTotalPrice } from '../cart/selectors/Selectors'
import {
    addToCartAPI,
    removeFromCartAPI,
    updateCartItemAPI,
    syncCartFromBackend,
    clearCartAPI
} from "./thunk/ThunkCartAPI";

interface ICartSlice {
    items: { [key: string]: number },
    productFullinformation: Product[],
    loading: "idle" | "succeeded" | "failed" | "pending",
    error: string | null
}

const initialState: ICartSlice = {
    items: {},
    productFullinformation: [],
    loading: "idle",
    error: null,
}

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addtocart: (state, action) => {
            const id = String(action.payload);
            if (state.items[id]) {
                state.items[id]++;
            } else {
                state.items[id] = 1;
            }
        },
        changeQuantity: (state, action: { payload: { id: string, qty: number } }) => {
            const { id, qty } = action.payload;
            if (id in state.items) {
                state.items[id] = qty;
            }
        },
        removeItem: (state, action) => {
            const id = String(action.payload)

            delete (state.items[id])

            state.productFullinformation = state.productFullinformation.filter((prod) => {
                return prod.id !== id
            })
        },
        // Override entire cart (used for syncing from backend)
        setCartItems: (state, action: { payload: { [key: string]: number } }) => {
            state.items = action.payload;
        },
        clearCart: (state) => {
            state.items = {};
            state.productFullinformation = [];
        },
        clearCartError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // FetchCart (products full info)
            .addCase(FetchCart.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(FetchCart.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.productFullinformation = Array.isArray(action.payload) ? action.payload : []
            })
            .addCase(FetchCart.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || action.error.message || "Something went wrong"
            })
            // Sync cart from backend
            .addCase(syncCartFromBackend.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(syncCartFromBackend.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = Object.fromEntries(Object.entries(action.payload).map(([k, v]) => [String(k), Number(v)]));
            })
            .addCase(syncCartFromBackend.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || "Failed to sync cart"
            })
            // Add to cart API
            .addCase(addToCartAPI.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(addToCartAPI.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = Object.fromEntries(Object.entries(action.payload.cartData || {}).map(([k, v]) => [String(k), Number(v)]));
            })
            .addCase(addToCartAPI.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || "Failed to add item"
            })
            // Remove from cart API
            .addCase(removeFromCartAPI.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(removeFromCartAPI.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = Object.fromEntries(Object.entries(action.payload.cartData || {}).map(([k, v]) => [String(k), Number(v)]));
                state.productFullinformation = state.productFullinformation.filter(
                    (prod) => state.items[String(prod.id)] !== undefined
                )
            })
            .addCase(removeFromCartAPI.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || "Failed to remove item"
            })
            // Update cart item API
            .addCase(updateCartItemAPI.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(updateCartItemAPI.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = Object.fromEntries(Object.entries(action.payload.cartData || {}).map(([k, v]) => [String(k), Number(v)]));
            })
            .addCase(updateCartItemAPI.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || "Failed to update item"
            })
            // Clear cart API
            .addCase(clearCartAPI.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.loading = 'succeeded'
                state.items = {};
                state.productFullinformation = [];
            })
            .addCase(clearCartAPI.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || "Failed to clear cart"
            })
    }
})

export { getTotalQuantity, selectCartTotalPrice }
export const { addtocart, changeQuantity, removeItem, setCartItems, clearCart, clearCartError } = CartSlice.actions
export default CartSlice.reducer
