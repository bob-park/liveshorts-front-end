import { SlicePattern } from 'zustand';

import { decodeJwt } from '@/utils/common';

export const createUserSlice: SlicePattern<UserState> = (set) => ({
  updateMe: (jwt) =>
    set(
      (state) => {
        const jwtPayload = decodeJwt(jwt);

        const user: User = {
          id: jwtPayload['id'],
          userId: jwtPayload['userId'],
          name: jwtPayload['name'],
          email: jwtPayload['email'],
          role: jwtPayload['role'],
          authorities: jwtPayload['authorities'],
        };

        return { me: user };
      },
      false,
      {
        type: 'user/updateMe',
      },
    ),
  updateDetailMe: (user) =>
    set(
      (state) => {
        return {
          me: {
            ...state.me,
            ...user,
          },
        };
      },
      false,
      {
        type: 'user/updateDetailMe',
      },
    ),
});
