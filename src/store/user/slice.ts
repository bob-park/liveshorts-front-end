import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

const initialState: UserState = {};

export default createSlice({
  name: 'user',
  initialState,
  reducers,
});
