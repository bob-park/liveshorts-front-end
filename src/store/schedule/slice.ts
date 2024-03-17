import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

const initialState: ScheduleState = {
  isLoading: false,
  schedules: [],
};

export default createSlice({
  name: 'schedule',
  initialState,
  reducers,
});
