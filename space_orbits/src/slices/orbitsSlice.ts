import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrbitsState {
    height: string; 
}

const initialState: OrbitsState = {
    height: '', 
};

const orbitsSlice = createSlice({
    name: 'orbits',
    initialState,
    reducers: {
        setHeight(state, action: PayloadAction<string>) {
            state.height = action.payload;
        },
    },
});

export const { setHeight } = orbitsSlice.actions;
export default orbitsSlice.reducer;
