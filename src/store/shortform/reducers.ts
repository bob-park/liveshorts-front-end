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

  // get shortform extra types
  requestGetExtraTypes: (state: ShortFormState) => {},
  successGetExtraTypes: (
    state: ShortFormState,
    action: PayloadAction<{ extraTypes: ShortFormExtraType[] }>,
  ) => {},
  failureGetExtraTypes: (state: ShortFormState) => {},

  // request copy
  requestCopyShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ taskId: string }>,
  ) => {},
  successCopyShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ result: ShortFormTask }>,
  ) => {},
  failureCopyShortForm: (state: ShortFormState) => {},
};

export default reducers;
