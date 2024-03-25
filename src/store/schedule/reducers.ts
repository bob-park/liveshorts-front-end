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
  // add short form schedule
  requestAddShortFormSchedule: (
    state: ScheduleState,
    action: PayloadAction<{
      request: {
        channelId: number;
        scheduleId: number;
        ranges: {
          itemId: string;
          time: { startTime: string; endTime: string };
        }[];
      };
    }>,
  ) => {},
  successAddShortFormSchedule: (
    state: ScheduleState,
    action: PayloadAction<{ result?: ShortFormRecordSchedule }>,
  ) => {
    const { result } = action.payload;

    const schedule = result?.schedule;

    const newSchedules = state.schedules.slice();

    const scheduleIndex = state.schedules.findIndex(
      (item) => item.scheduleId === schedule?.scheduleId,
    );

    if (scheduleIndex > -1) {
      newSchedules[scheduleIndex] = {
        ...newSchedules[scheduleIndex],
        shorts: result,
      };
    }

    state.schedules = newSchedules;
  },
  failureAddShortFormSchedule: (state: ScheduleState) => {},
};

export default reducers;
