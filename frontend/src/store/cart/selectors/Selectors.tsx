import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export const getTotalQuantity = createSelector((state) => state.cart.items, (items) => {
    const value = Object.values(items) as number[]
    const totalcount = value.reduce((acc, curr) => {
        return acc + curr
    }, 0)
    return totalcount
}

)

export const selectCartTotalPrice = (state: RootState) => {
    return state.cart.productFullinformation.reduce((total, product) => {
        const quantity = state.cart.items[product.id] || 0;
        return total + (Number(product.price) * quantity);
    }, 0);
};