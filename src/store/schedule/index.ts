import { createSelector } from '@reduxjs/toolkit';
import slice from './slice';
import { RootState } from '@/store/rootStore';

const selectorAllState = createSelector(
  (state: ScheduleState) => state.isLoading,
  (schedules) => ({ schedules }),
);

export const shortFormSelector = {
  all: (state: RootState) => selectorAllState(state[SCHEDULE]),
};

export const SCHEDULE = slice.name;
export const scheduleReducer = slice.reducer;
export const scheduleActions = slice.actions;
