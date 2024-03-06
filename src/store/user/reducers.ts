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
    state.isLoggingIn = true;
    state.me = undefined;
  },
  successLoggedIn: (state: UserState, action: PayloadAction<User>) => {
    state.isLoggingIn = false;
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
  // touch
  requestUpdateMe: (state: UserState, action: PayloadAction<string>) => {
    state.me = undefined;
  },
  successUpdateMe: (state: UserState, action: PayloadAction<User>) => {
    state.me = action.payload;
  },
};

export default reducers;
