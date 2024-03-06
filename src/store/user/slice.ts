import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

const initialState: UserState = {
  isLoggingIn: false,
};

export default createSlice({
  name: 'user',
  initialState,
  reducers,
});
