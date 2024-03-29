import { PayloadAction } from '@reduxjs/toolkit';

const reducers = {
  // search shortFormTask
  requestSearchShortFormTask: (
    state: ShortFormState,
    action: PayloadAction<{ assetId: number }>,
  ) => {
    state.isLoading = true;
  },
  successSearchShortFormTask: (
    state: ShortFormState,
    action: PayloadAction<{ tasks: ShortFormTask[] }>,
  ) => {
    const { tasks } = action.payload;
    state.isLoading = false;
    state.tasks = tasks;
  },
  failureSearchShortFormTask: (state: ShortFormState) => {
    state.isLoading = false;
  },
};

export default reducers;
