import { createSelector } from '@reduxjs/toolkit';
import slice from './slice';
import { RootState } from '@/store/rootStore';

const selectorAllState = createSelector(
  (state: ShortFormState) => state.isLoading,
  (tasks) => ({ tasks }),
);

export const userSelector = {
  all: (state: RootState) => selectorAllState(state[SHORT_FORM]),
};

export const SHORT_FORM = slice.name;
export const shortFormReducer = slice.reducer;
export const shortFormActions = slice.actions;
