import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Transition, T_Orbit } from "../../modules/types.ts";
import { AxiosResponse } from "axios";
import { NEXT_YEAR, PREV_YEAR } from "../../utils/consts";
import { api } from "../../API";


type T_TransitionsState = {
  draft_transition: number | null;
  orbits_to_transfer: number | null;
  transition: T_Transition | null;
  transitions: T_Transition[];
  filters: T_TransitionsFilters;
  save_mm: boolean;
};

export type T_TransitionsFilters = {
  date_formation_start: string;
  date_formation_end: string;
  status: string;
};

const initialState: T_TransitionsState = {
  draft_transition: null,
  orbits_to_transfer: null,
  transition: null,
  transitions: [],
  filters: {
    status: "",
    date_formation_start: PREV_YEAR.toISOString().split("T")[0],
    date_formation_end: NEXT_YEAR.toISOString().split("T")[0],
  },
  save_mm: false,
};

export const fetchTransition = createAsyncThunk<T_Transition, string>(
  "transitions/fetchTransition",
  async (transition_id) => {
    const response = (await api.transitions.transitionsRead(transition_id)) as unknown as AxiosResponse<T_Transition>;
    console.log(transition_id)
    return response.data;
  }
);

export const fetchTransitions = createAsyncThunk<T_Transition[], void, { state: { transitions: T_TransitionsState } }>(
  "transitions/fetchtransitions",
  async (_, { getState }) => {
    const { filters } = getState().transitions;
    const response = (await api.transitions.transitionsList ({
        status: filters.status,
        date_formation_start: filters.date_formation_start,
        date_formation_end: filters.date_formation_end,
    })) as unknown as AxiosResponse<T_Transition[]>;
    return response.data;
  }
);

export const removeOrbitFromDraftTransition = createAsyncThunk<T_Orbit[], string, { state: { transitions: T_TransitionsState } }>(
    "transitions/removeOrbitFromDraftTransition",
    async (orbit_id, { getState }) => {
      const { transition } = getState().transitions;
  
      if (!transition?.id) {
        throw new Error("Transition ID is required to remove an orbit.");
      }
  
      const response = (await api.transitions.transitionsDeleteOrbitFromTransitionDelete (String(transition.id), orbit_id)) as AxiosResponse<T_Orbit[]>;
      return response.data;
    }
  );
  
  export const deleteDraftTransition = createAsyncThunk<void, void, { state: { transitions: T_TransitionsState } }>(
    "transitions/deleteDraftTransition",
    async (_, { getState }) => {
      const { transition } = getState().transitions;
  
      if (!transition?.id) {
        throw new Error("Shipment ID is required to delete a draft shipment.");
      }
  
      await api.transitions.transitionsDeleteDelete(String(transition.id));
    }
  );
  
export const sendDraftTransition = createAsyncThunk<
  void, 
  void, 
  { state: { transitions: T_TransitionsState } }
>(
  "transitions/sendDraftTransition",
  async (_, { getState }) => {
    console.log("sendDraftTransition: Начало выполнения");

    const { transition } = getState().transitions;

    console.log("sendDraftTransition: Текущее состояние transition:", transition);

    if (!transition?.id) {
      console.error("sendDraftTransition: Ошибка - отсутствует ID перехода.");
      throw new Error("Transition ID is required to send a draft transition.");
    }

    console.log(`sendDraftTransition: Переход ID перехода: ${transition.id}`);

    try {
      await api.transitions.transitionsUpdateStatusUserUpdate(String(transition.id));
      console.log("sendDraftTransition: Успешно обновлен статус отправки.");
    } catch (error) {
      console.error("sendDraftTransition: Ошибка при обновлении статуса перехода:", error);
      throw error; // Пробрасываем ошибку дальше
    }
  }
);

  
export const updateTransition = createAsyncThunk<void, Partial<T_Transition>, { state: { transitions: T_TransitionsState } }>(
  "transitions/updateTransition",
  async (data, { getState }) => {
    const { transition } = getState().transitions;
    if (!transition?.id) {
      throw new Error("Transition ID is required to update a transition.");
    }
    try {
      await api.transitions.transitionsUpdateUpdate(String(transition.id), { ...data });
    } catch (error) {
      throw error;
    }
  }
);

  
  export const updateOrbitPosition = createAsyncThunk<void, { orbit_id: string }, { state: { transitions: T_TransitionsState } }>(
    "transitions/updateOrbitPosition",
    async ({ orbit_id }, { getState }) => {
      const { transition } = getState().transitions;
  
      if (!transition?.id) {
        throw new Error("Transition ID is required to update orbit position.");
      }
  
      await api.transitions.transitionsUpdateOrbitTransitionUpdate(String(transition.id), orbit_id);
    }
  );

const transitionsSlice = createSlice({
  name: "transitions",
  initialState,
  reducers: {
    saveTransition: (state, action: PayloadAction<{ draft_transition: number; orbits_to_transfer: number }>) => {
      state.draft_transition = action.payload.draft_transition;
      state.orbits_to_transfer = action.payload.orbits_to_transfer;
    },
    removeTransition: (state) => {
      state.transition = null;
    },
    triggerUpdateMM: (state) => {
      state.save_mm = !state.save_mm;
    },
    updateFilters: (state, action: PayloadAction<T_TransitionsFilters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransition.fulfilled, (state, action: PayloadAction<T_Transition>) => {
        state.transition = action.payload;
      })
      .addCase(fetchTransitions.fulfilled, (state, action: PayloadAction<T_Transition[]>) => {
        state.transitions = action.payload;
      })
      .addCase(removeOrbitFromDraftTransition.fulfilled, (state, action: PayloadAction<T_Orbit[]>) => {
        if (state.transition) {
          state.transition.orbits = action.payload;
        }
      })
      .addCase(sendDraftTransition.fulfilled, (state) => {
        state.transition = null;
      });
  },
});

export const { saveTransition, removeTransition, triggerUpdateMM, updateFilters } = transitionsSlice.actions;
export default transitionsSlice.reducer;