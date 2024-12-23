import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Orbit, T_OrbitsListResponse } from "../../modules/types.ts";
import { ORBITS_MOCK } from "../../modules/mock";
import  {saveTransition}  from "./transitionsSlice.ts";
import { api } from "../../API";
import { useSelector } from 'react-redux';
import { AxiosResponse } from "axios";
import { RootState } from "../store";
import { setDraftTransition } from "./transitionsSlice.ts";
import type { AppDispatch } from "../store";

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


export const fetchOrbits = createAsyncThunk<
    T_Orbit[],
    void,
    { state: RootState; rejectValue: string }
>('orbits/fetchOrbits', async (_, { getState, rejectWithValue }) => {
    try {
        const response = await api.orbits.orbitsList();
        console.log('API Response:', response); // Логирование ответа от API
        
        const data = response.data as T_OrbitsListResponse;
        if (!data || !Array.isArray(data.orbits)) {
            throw new Error('Invalid API data');
        }
        return data.orbits;
    } catch (error) {
        console.error('Error fetching orbits:', error);
        return rejectWithValue('Failed to fetch orbits');
    }
});


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
      orbits_to_transfer: response.data.orbits_to_transfer
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

export const createOrbit = createAsyncThunk<
    void,
    Omit<T_Orbit, 'id'>,
    { rejectValue: string }
>('orbits/createOrbit', async (orbitData, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.orbits.orbitsCreateCreate(orbitData);
        if (!response.data) throw new Error('Failed to create operation');
        (dispatch as AppDispatch)(fetchOrbits());
    } catch (error) {
        console.error('Error creating operation:', error);
        return rejectWithValue('Failed to create operation');
    }
});

export const deleteOrbit = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("orbits/deleteOrbit", async (id, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.orbits.orbitsDeleteDelete(String(id));
    if (response.status !== 200) throw new Error("Failed to delete orbit");

    (dispatch as AppDispatch)(fetchOrbits());
  } catch (error) {
    console.error("Error deleting orbit:", error);
    return rejectWithValue("Failed to delete obit");
  }
});

export const updateOrbit = createAsyncThunk<
    void,
    T_Orbit,
    { rejectValue: string }
>('orbits/updateOrbit', async (orbit, { rejectWithValue }) => {
    try {
        const response = await api.orbits.orbitsUpdateUpdate(String(orbit.id), orbit);
        if (!response.data) throw new Error('Failed to update orbit');
    } catch (error) {
        console.error('Error updating orbit:', error);
        return rejectWithValue('Failed to update orbit');
    }
});

export const updateOrbitImage = createAsyncThunk<
    string,
    { id: string; formData: FormData },
    { rejectValue: string }
>('orbits/updateOrbitImage', async ({ id, formData }, { rejectWithValue }) => {
    try {
        // Отправка formData на сервер
        const response = await api.orbits.orbitsUpdateImageCreate(id, formData);

        const data = response.data;

        // Проверяем, что image является строкой (URL)
        if (!data.image || typeof data.image !== 'string') {
            throw new Error('Invalid image URL');
        }

        // Возвращаем только имя файла (последнюю часть URL)
        return data.image.split('/').pop()!;
    } catch (error) {
        console.error('Error updating operation image:', error);
        return rejectWithValue('Failed to update image');
    }
});




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
          
          builder.addCase(fetchOrbits.fulfilled, (state, action) => {
            state.orbits = action.payload;
        })
        builder.addCase(fetchOrbits.rejected, (state, action) => {
            state.orbits = [];
        })  
    }
});

export const useHeight = () => useSelector((state: RootState) => state.orbits.height);

export const { setHeight, removeSelectedOrbit } = orbitsSlice.actions;

export default orbitsSlice.reducer;