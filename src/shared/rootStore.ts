import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createUserSlice } from './user';
import { createAssetSlice } from './asset';
import { createAlertSlice } from './alert';

export const useStore = create<BoundState>()(
  devtools(
    immer((...a) => ({
      ...createUserSlice(...a),
      ...createAssetSlice(...a),
      ...createAlertSlice(...a),
    })),
    {
      name: 'liveshorts-store',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

export type BoundState = UserState & AssetState & AlertState;
