import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskStatus } from '../../types';

interface UiState {
  filters: {
    search: string;
    status: TaskStatus | '';
    page: number;
    limit: number;
  };
}

const initialState: UiState = {
  filters: {
    search: '',
    status: '',
    page: 1,
    limit: 10,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset page when search changes
    },
    setStatusFilter: (state, action: PayloadAction<TaskStatus | ''>) => {
      state.filters.status = action.payload;
      state.filters.page = 1; // Reset page when status filter changes
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset page when limit changes
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setSearch, setStatusFilter, setPage, setLimit, resetFilters } = uiSlice.actions;

export default uiSlice.reducer;