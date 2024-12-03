import { configureStore } from '@reduxjs/toolkit';
import orbitsReducer from './slices/orbitsSlice';

const store = configureStore({
    reducer: {
        orbits: orbitsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
