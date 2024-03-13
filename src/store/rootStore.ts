import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';

import rootSaga from './rootSaga';

// user
import { userReducer } from './user';

// asset
import { assetReducer } from './asset';

const rootReducer = combineReducers({
  user: userReducer,
  asset: assetReducer,
});

function rootStore() {
  // saga
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  sagaMiddleware.run(rootSaga);

  return store;
}

export const store = rootStore();

export type RootState = ReturnType<typeof rootReducer>;

export const wrapper = createWrapper<AppStore>(rootStore, {
  debug: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
});

export type AppStore = ReturnType<typeof rootStore>;
export type AppDispatch = typeof store.dispatch;
