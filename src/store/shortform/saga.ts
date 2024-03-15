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

import { shortFormActions } from '.';

// action
const {
  // search shortFormTask
  requestSearchShortFormTask,
  successSearchShortFormTask,
  failureSearchShortFormTask,
} = shortFormActions;

// search shortFormTask
function* callSearchShortFormTask(
  action: ReturnType<typeof requestSearchShortFormTask>,
) {
  const { assetId } = action.payload;

  const result: ApiResult<ShortFormTask[]> = yield call(
    get,
    '/api/v1/shorts/task/search',
    { assetId },
  );

  if (result.state === 'FAILURE') {
    yield put(failureSearchShortFormTask());
    return;
  }

  yield put(successSearchShortFormTask({ tasks: result.data || [] }));
}

function* watchSearchShortFormTask() {
  yield takeLatest(requestSearchShortFormTask, callSearchShortFormTask);
}

export default function* shortFormSagas() {
  yield all([fork(watchSearchShortFormTask)]);
}
