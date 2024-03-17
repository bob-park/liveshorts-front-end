import { PayloadAction } from '@reduxjs/toolkit';

const reducers = {
  // get schedule
  requestGetSchedule: (
    state: ScheduleState,
    action: PayloadAction<{
      channelId: number;
      startDateTime: string;
      endDateTime: string;
    }>,
  ) => {
    state.isLoading = true;
  },
  successGetSchedule: (
    state: ScheduleState,
    action: PayloadAction<{ schedules: RecordSchedule[] }>,
  ) => {
    const { schedules } = action.payload;

    state.isLoading = false;
    state.schedules = schedules;
  },
  failureGetSchedule: (state: ScheduleState) => {
    state.isLoading = false;
  },
};

export default reducers;
