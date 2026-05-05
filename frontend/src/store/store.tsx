import { configureStore, combineReducers, createListenerMiddleware } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import products from "./product.tsx/ProductsSlice";
import cart from "./cart/CartSlice";
import auth from "./auth/AuthSlice";
import FetchCart from "./cart/thunk/ThunkGetCart";
import { syncCartFromBackend, addToCartAPI } from "./cart/thunk/ThunkCartAPI";

const listenerMiddleware = createListenerMiddleware();

// Listen for syncCartFromBackend fulfillment and dispatch FetchCart
listenerMiddleware.startListening({
    actionCreator: syncCartFromBackend.fulfilled,
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(FetchCart());
    }
});

// Listen for addToCartAPI fulfillment and dispatch FetchCart
listenerMiddleware.startListening({
    actionCreator: addToCartAPI.fulfilled,
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(FetchCart());
    }
});

// Create a custom storage object that wraps localStorage with Promise support
const storage = {
    getItem: (key: string): Promise<string | null> => {
        return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key: string, value: string): Promise<void> => {
        return Promise.resolve(localStorage.setItem(key, value));
    },
    removeItem: (key: string): Promise<void> => {
        return Promise.resolve(localStorage.removeItem(key));
    },
};

// 1. إعداد خاص بالسلة فقط لتحديد حقول معينة (مثل items)
const cartPersistConfig = {
    key: 'cart-v1',
    storage,
    whitelist: ['items']
};

const rootReducer = combineReducers({
    // نطبق الـ persist على الـ cart reducer بشكل منفصل
    cart: persistReducer(cartPersistConfig, cart),
    products,
    auth
});

// ملاحظة: بما أننا طبقنا الـ persist بالأسفل على الـ cart، لا نحتاج لعمل persist للـ root بالكامل إلا لو أردت
// لكن الأفضل والمتبع هو تمرير الـ rootReducer مباشرة للـ store في هذه الحالة

export const store = configureStore({
    reducer: rootReducer, // نمرر الـ rootReducer الذي يحتوي على الـ persisted cart
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
export default { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
