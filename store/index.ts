import {configureStore} from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authSlice from './auth/authSlice';
import categorySlice from './category/categorySlice';
import itemSlice from './item/itemSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        category: categorySlice,
        item: itemSlice,
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;