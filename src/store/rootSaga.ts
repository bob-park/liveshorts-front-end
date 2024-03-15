import { call, all } from 'redux-saga/effects';

import userSagas from './user/saga';
import assetSagas from './asset/saga';
import shortFormSagas from './shortform/saga';

export default function* rootSaga() {
  yield all([call(userSagas), call(assetSagas), call(shortFormSagas)]);
}
