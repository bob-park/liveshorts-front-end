import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

const initialState: ShortFormState = {
  isLoading: false,
  tasks: [],
  page: {
    currentPage: 0,
    size: 20,
    totalCount: 0,
    totalPage: 0,
  },
  extraTypes: [],
};

export default createSlice({
  name: 'shortForm',
  initialState,
  reducers,
});
