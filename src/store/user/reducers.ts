import { PayloadAction } from '@reduxjs/toolkit';

const reducers = {
  // logged in
  requestLoggedIn: (
    state: UserState,
    action: PayloadAction<{
      userId: string;
      password: string;
    }>,
  ) => {
    state.isLoggedIn = false;
    state.isLoggingIn = true;
    state.me = undefined;
  },
  successLoggedIn: (state: UserState, action: PayloadAction<User>) => {
    state.isLoggingIn = false;
    state.isLoggedIn = true;
    state.me = action.payload;
    state.failLoggedInMessage = undefined;
  },
  failureLoggedIn: (
    state: UserState,
    action: PayloadAction<{ failureMessage?: string }>,
  ) => {
    const { failureMessage } = action.payload;

    state.isLoggingIn = false;
    state.me = undefined;
    state.failLoggedInMessage = failureMessage;
  },
  // logged out
  requestLoggedOut: (state: UserState) => {},
  successLoggedOut: (state: UserState) => {
    state.me = undefined;
    state.isLoggedIn = false;
  },
  failureLoggedOut: (state: UserState) => {},
  // touch
  requestUpdateMe: (state: UserState, action: PayloadAction<string>) => {
    state.me = undefined;
  },
  successUpdateMe: (state: UserState, action: PayloadAction<User>) => {
    state.me = action.payload;
    state.isLoggedIn = true;
  },

  // get user
  requestGetUser: (
    state: UserState,
    action: PayloadAction<{ id: number }>,
  ) => {},
  successGetUser: (state: UserState, action: PayloadAction<User>) => {
    const user = action.payload;

    state.me = {
      ...state.me,
      ...user,
    };
  },
  failureGetUser: (state: UserState) => {},
};

export default reducers;
