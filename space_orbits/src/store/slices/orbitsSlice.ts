import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Orbit, T_OrbitsListResponse } from "../../modules/types.ts";
import { ORBITS_MOCK } from "../../modules/mock";
import  {saveTransition}  from "./transitionsSlice.ts";
import { api } from "../../API";
import { useSelector } from 'react-redux';
import { AxiosResponse } from "axios";
import { RootState } from "../store";

type T_OrbitsSlice = {
    height: number;
    selectedOrbit: null | T_Orbit;
    orbits: T_Orbit[];
};

const initialState: T_OrbitsSlice = {
    height: 0,
    selectedOrbit: null,
    orbits: [],
};

export const getOrbitById = createAsyncThunk<T_Orbit, string, { state: RootState }>(
    "fetch_orbit",
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.orbits.orbitsRead(id);
        return response.data;
      } catch (error) {

        const mockOrbit = ORBITS_MOCK.orbits.find((orbit) => String(orbit.id) === id) as T_Orbit;
        if (mockOrbit) {
          return rejectWithValue(mockOrbit);
        }
        throw error;
      }
    }
  );
  

export const getOrbitsByHeight = createAsyncThunk<T_Orbit[], object, { state: RootState }>(
  "fetch_orbits",
  async function(_, thunkAPI) {
    const state = thunkAPI.getState() as RootState;
    const response = await api.orbits.orbitsList({
      orbit_height: String(state.orbits.height)
    }) as unknown as AxiosResponse<T_OrbitsListResponse>;

    thunkAPI.dispatch(saveTransition({
      draft_transition: response.data.draft_transition,
      orbits_to_transfer: response.data.orbits_to_tranfer
    }));

    return response.data.orbits;
  }
);

export const addOrbitToTransition = createAsyncThunk<void, string, { state: RootState }>(
    "orbits/add_orbit_to_transition",
    async function(orbit_id) {
        await api.orbits.orbitsAddToTransitionCreate(orbit_id);
    }
);

const orbitsSlice = createSlice({
    name: 'orbits',
    initialState: initialState,
    reducers: {
        setHeight: (state, action) => {
            state.height = action.payload;
        },
        removeSelectedOrbit: (state) => {
            state.selectedOrbit = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrbitsByHeight.fulfilled, (state: T_OrbitsSlice, action: PayloadAction<T_Orbit[]>) => {
            state.orbits = action.payload;
        });
        builder.addCase(getOrbitById.fulfilled, (state: T_OrbitsSlice, action: PayloadAction<T_Orbit>) => {
            state.selectedOrbit = action.payload;
        });
        builder.addCase(getOrbitById.rejected, (state, action) => {
            if (action.payload && typeof action.payload === "object") {
              state.selectedOrbit = action.payload as T_Orbit;
            } else {
              state.selectedOrbit = null;
            }
          });
    }
});

export const useHeight = () => useSelector((state: RootState) => state.orbits.height);

export const { setHeight, removeSelectedOrbit } = orbitsSlice.actions;

export default orbitsSlice.reducer;