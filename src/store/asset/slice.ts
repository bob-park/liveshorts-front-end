import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

const initialState: AssetState = {
  isLoading: false,
  assets: [],
  pagination: {
    currentPage: 0,
    size: 0,
    totalCount: 0,
    totalPage: 0,
  },
  searchParams: {
    page: 0,
    size: 20,
    isDeleted: false,
    assetStatus: 'REGISTERED',
  },
};

export default createSlice({
  name: 'asset',
  initialState,
  reducers,
});
