import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import orbitsReducer from "./slices/orbitsSlice.ts";
import userReducer from "./slices/userSlice.ts";
import transitionsReducer from "./slices/transitionsSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        orbits: orbitsReducer,
        user: userReducer,
        transitions: transitionsReducer
    }
});
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;