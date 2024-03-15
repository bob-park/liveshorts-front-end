import {
  call,
  all,
  takeLatest,
  fork,
  put,
  delay,
  take,
} from 'redux-saga/effects';

import { get, post, put as putCall, del, decodeJwt } from '@/utils/common';

import { assetActions } from '.';

// action
const {
  // search asset
  requestSearchAsset,
  successSearchAsset,
  failureSearchAsset,
} = assetActions;

// search asset
function* callSearchAsset(action: ReturnType<typeof requestSearchAsset>) {
  const { params, isAppend } = action.payload;

  const result: ApiResult<Asset[]> = yield call(
    get,
    '/api/asset/search',
    params,
  );

  yield delay(500);

  if (result.state !== 'SUCCESS') {
    yield put(failureSearchAsset());
    return;
  }

  yield put(
    successSearchAsset({
      assets: result.data || [],
      pagination: result.page || {
        currentPage: 0,
        size: 0,
        totalCount: 0,
        totalPage: 0,
      },
      isAppend,
    }),
  );
}

function* watchSearchAsset() {
  yield takeLatest(requestSearchAsset, callSearchAsset);
}

export default function* userSagas() {
  yield all([fork(watchSearchAsset)]);
}
