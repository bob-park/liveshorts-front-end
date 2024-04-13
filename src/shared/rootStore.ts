import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createUserSlice } from './user';

export const useStore = create<BoundState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createUserSlice(...a),
      })),
      { name: 'liveshorts-store' },
    ),
    {
      name: 'liveshorts-store',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

export type BoundState = UserState;
