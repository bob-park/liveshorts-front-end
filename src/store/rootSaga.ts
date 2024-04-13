import { call, all } from 'redux-saga/effects';

import scheduleSagas from './schedule/saga';

export default function* rootSaga() {
  yield all([call(scheduleSagas)]);
}
