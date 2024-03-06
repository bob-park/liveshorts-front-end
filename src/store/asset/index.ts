import { createSelector } from '@reduxjs/toolkit';
import slice from './slice';
import { RootState } from '@/store/rootStore';

const selectorAllState = createSelector(
  (state: AssetState) => state.isLoading,
  (assets) => ({ assets }),
);

export const userSelector = {
  all: (state: RootState) => selectorAllState(state[ASSET]),
};

export const ASSET = slice.name;
export const assetReducer = slice.reducer;
export const assetActions = slice.actions;
