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
  author: string;
};

const initialState: T_TransitionsState = {
  draft_transition: null,
  orbits_to_transfer: null,
  transition: null,
  transitions: [],
  filters: {
    author: "",
    status: "",
    date_formation_start: PREV_YEAR.toISOString().split("T")[0],
    date_formation_end: NEXT_YEAR.toISOString().split("T")[0],
  },
  save_mm: false,
};

export const fetchTransition = createAsyncThunk<T_Transition, string>(
  "transitions/fetchTransition",
  async (transition_id) => {
    try {
      const response = (await api.transitions.transitionsRead(transition_id)) as AxiosResponse<T_Transition>;
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при получении данных перехода с ID ${transition_id}: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при получении данных перехода.");
      }
    }
  }
);

export const fetchTransitions = createAsyncThunk<T_Transition[], void, { state: { transitions: T_TransitionsState } }>(
  "transitions/fetchTransitions",
  async (_, { getState }) => {
    const { filters } = getState().transitions;
    try {
      const response = (await api.transitions.transitionsList({
        status: filters.status,
        date_formation_start: filters.date_formation_start,
        date_formation_end: filters.date_formation_end,
      })) as AxiosResponse<T_Transition[]>;
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при получении списка переходов: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при получении списка переходов.");
      }
    }
  }
);

export const removeOrbitFromDraftTransition = createAsyncThunk<T_Orbit[], string, { state: { transitions: T_TransitionsState } }>(
  "transitions/removeOrbitFromDraftTransition",
  async (orbit_id, { getState }) => {
    const { transition } = getState().transitions;

    if (!transition?.id) {
      throw new Error("Transition ID is required to remove an orbit.");
    }

    try {
      const response = (await api.transitions.transitionsDeleteOrbitFromTransitionDelete(String(transition.id), orbit_id)) as AxiosResponse<T_Orbit[]>;
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при удалении орбиты с перехода: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при удалении орбиты.");
      }
    }
  }
);

export const deleteDraftTransition = createAsyncThunk<void, void, { state: { transitions: T_TransitionsState } }>(
  "transitions/deleteDraftTransition",
  async (_, { getState }) => {
    const { transition } = getState().transitions;

    if (!transition?.id) {
      throw new Error("Transition ID is required to delete a draft transition.");
    }

    try {
      await api.transitions.transitionsDeleteDelete(String(transition.id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при удалении перехода с ID ${transition.id}: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при удалении перехода.");
      }
    }
  }
);

export const sendDraftTransition = createAsyncThunk<void, void, { state: { transitions: T_TransitionsState } }>(
  "transitions/sendDraftTransition",
  async (_, { getState }) => {
    const { transition } = getState().transitions;

    if (!transition?.id) {
      throw new Error("Transition ID is required to send a draft transition.");
    }

    try {
      await api.transitions.transitionsUpdateStatusUserUpdate(String(transition.id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при отправке перехода с ID ${transition.id}: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при отправке перехода.");
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при обновлении перехода с ID ${transition.id}: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при обновлении перехода.");
      }
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

    try {
      await api.transitions.transitionsUpdateOrbitTransitionUpdate(String(transition.id), orbit_id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при обновлении орбиты для перехода с ID ${transition.id}: ${error.message}`);
      } else {
        throw new Error("Неизвестная ошибка при обновлении орбиты.");
      }
    }
  }
);

export const completeTransition = createAsyncThunk("transitions/completeTransition", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.transitions.transitionsUpdateStatusAdminUpdate(String(id), { status: "completed" });
    if (!response.data) {
      throw new Error("Не удалось завершить заявку");
    }
    return id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(`Ошибка при завершении заявки с ID ${id}: ${error.message}`);
    } else {
      return rejectWithValue("Неизвестная ошибка при завершении заявки.");
    }
  }
});

export const rejectTransition = createAsyncThunk("transitions/rejectTransition", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.transitions.transitionsUpdateStatusAdminUpdate(String(id), { status: "rejected" });
    if (!response.data) {
      throw new Error("Не удалось отклонить заявку");
    }
    return id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(`Ошибка при отклонении заявки с ID ${id}: ${error.message}`);
    } else {
      return rejectWithValue("Неизвестная ошибка при отклонении заявки.");
    }
  }
});

const transitionsSlice = createSlice({
  name: "transitions",
  initialState,
  reducers: {
    setDraftTransition: (state, action: PayloadAction<{ draftTransitionId: number; orbits_to_transfer: number }>) => {
      state.draft_transition = action.payload.draftTransitionId;
      state.orbits_to_transfer = action.payload.orbits_to_transfer;
    },
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
    updateFilters: (state, action: PayloadAction<Partial<T_TransitionsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
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

export const { saveTransition, removeTransition, triggerUpdateMM, updateFilters, setDraftTransition } = transitionsSlice.actions;
export default transitionsSlice.reducer;
