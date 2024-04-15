import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createUserSlice } from './user';
import { createAssetSlice } from './asset';

export const useStore = create<BoundState>()(
  devtools(
    immer((...a) => ({
      ...createUserSlice(...a),
      ...createAssetSlice(...a),
    })),
    {
      name: 'liveshorts-store',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

export type BoundState = UserState & AssetState;
