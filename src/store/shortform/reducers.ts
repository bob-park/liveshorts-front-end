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

  // create
  requestCreateShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ assetId: number; title: string }>,
  ) => {},
  successCreateShortForm: (
    state: ShortFormState,
    action: PayloadAction<ShortFormTask>,
  ) => {},
  failureCreateShortForm: (state: ShortFormState) => {},

  // update
  requestUpdateShortForm: (
    state: ShortFormState,
    action: PayloadAction<{
      taskId: string;
      title: string;
      templateId?: string;
    }>,
  ) => {},
  successUpdateShortForm: (
    state: ShortFormState,
    action: PayloadAction<ShortFormTask>,
  ) => {
    const shortform = action.payload;

    const newTasks = state.tasks.slice();

    const index = newTasks.findIndex((item) => item.id === shortform.id);

    if (index >= 0) {
      newTasks[index] = shortform;
    }

    state.tasks = newTasks;
  },
  failureUpdateShortForm: (state: ShortFormState) => {},

  // copy
  requestCopyShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ taskId: string }>,
  ) => {
    state.copiedTaskId = undefined;
  },
  successCopyShortForm: (
    state: ShortFormState,
    action: PayloadAction<ShortFormTask>,
  ) => {
    const shortFormTask = action.payload;

    const newTasks = state.tasks.slice();
    newTasks.unshift(shortFormTask);

    state.tasks = newTasks;
    state.copiedTaskId = shortFormTask.id;
  },
  failureCopyShortForm: (state: ShortFormState) => {
    state.copiedTaskId = undefined;
  },

  // remove
  requestRemoveShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ taskId: string }>,
  ) => {},
  successRemoveShortForm: (
    state: ShortFormState,
    action: PayloadAction<{ taskId: string }>,
  ) => {
    const { taskId } = action.payload;

    const newTasks = state.tasks.slice();

    const index = newTasks.findIndex((item) => item.id === taskId);

    if (index >= 0) {
      newTasks.splice(index, 1);
    }

    state.tasks = newTasks;
  },
  faliureRemoveShortForm: (state: ShortFormState) => {},
};

export default reducers;
