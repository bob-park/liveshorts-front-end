import { PayloadAction } from '@reduxjs/toolkit';

const reducers = {
  // search asset
  requestSearchAsset: (
    state: AssetState,
    action: PayloadAction<SearchAssetParams>,
  ) => {
    state.isLoading = true;
    state.searchParams = action.payload;
  },
  successSearchAsset: (
    state: AssetState,
    action: PayloadAction<{ assets: Asset[]; pagination: Pagination }>,
  ) => {
    const { assets, pagination } = action.payload;

    state.isLoading = false;

    state.assets = assets;
    state.pagination = pagination;
  },
  failureSearchAsset: (state: AssetState) => {
    state.isLoading = false;
  },
};

export default reducers;
