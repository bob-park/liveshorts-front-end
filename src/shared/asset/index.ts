import { SlicePattern } from 'zustand';

export const createAssetSlice: SlicePattern<AssetState> = (set) => ({
  assets: [],
  searchAssetAfter: (assets, page) =>
    set(
      (state) => {
        return {
          assets: page?.currentPage == 0 ? assets : state.assets.concat(assets),
          assetsPage: page,
        };
      },
      false,
      { type: 'asset/searchAfter' },
    ),
  initAssetPage: () =>
    set(
      (state) => {
        return { ...state, assetsPage: undefined };
      },
      false,
      {
        type: 'asset/initPage',
      },
    ),
});
