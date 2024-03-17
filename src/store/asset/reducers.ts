import { PayloadAction } from '@reduxjs/toolkit';

const reducers = {
  // search asset
  requestSearchAsset: (
    state: AssetState,
    action: PayloadAction<{ params: SearchAssetParams; isAppend: boolean }>,
  ) => {
    const { params, isAppend } = action.payload;

    state.isLoading = true;
    state.searchParams = params;

    if (!isAppend) {
      state.assets = [];
    }
  },
  successSearchAsset: (
    state: AssetState,
    action: PayloadAction<{
      assets: Asset[];
      pagination: Pagination;
      isAppend: boolean;
    }>,
  ) => {
    const { assets, pagination, isAppend } = action.payload;

    state.isLoading = false;

    // state.assets = assets;

    if (isAppend) {
      const prev = state.assets.slice();

      const newAssets = assets.filter((asset) =>
        state.assets.every((item) => item.assetId != asset.assetId),
      );

      state.assets = prev.concat(newAssets);
    } else {
      state.assets = assets;
    }

    state.pagination = pagination;
  },
  failureSearchAsset: (state: AssetState) => {
    state.isLoading = false;
  },
};

export default reducers;
