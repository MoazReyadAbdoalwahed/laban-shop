import { createSlice } from "@reduxjs/toolkit";
import FetchProducts, { FetchSingleProduct } from "./thunk/thunkGetProducts";
import type { Product } from "../../types/product";
interface Iproduct {

    items: Product[],
    selectedProduct: Product | null,
    loading: "idle" | "succeeded" | "failed" | "pending",
    error: string | null,
}

const initialState: Iproduct = {

    items: [],
    selectedProduct: null,
    loading: "idle",
    error: null,
}


const productSlice = createSlice({
    name: "products",
    initialState,

    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchProducts.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(FetchProducts.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = action.payload
            })
            .addCase(FetchProducts.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || action.error.message || "Something went wrong"
            })
            .addCase(FetchSingleProduct.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(FetchSingleProduct.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.selectedProduct = action.payload || null
            })
            .addCase(FetchSingleProduct.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string || action.error.message || "Something went wrong"
            })
    }

})
export const { clearSelectedProduct } = productSlice.actions
export { productSlice }
export default productSlice.reducer

