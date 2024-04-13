import { call, all } from 'redux-saga/effects';

import shortFormSagas from './shortform/saga';
import scheduleSagas from './schedule/saga';

export default function* rootSaga() {
  yield all([call(shortFormSagas), call(scheduleSagas)]);
}
