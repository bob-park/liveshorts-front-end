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

  // create
  requestCreateShortForm,
  successCreateShortForm,
  failureCreateShortForm,

  // copy
  requestCopyShortForm,
  successCopyShortForm,
  failureCopyShortForm,

  // remove
  requestRemoveShortForm,
  successRemoveShortForm,
  faliureRemoveShortForm,
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

  yield delay(500);

  if (result.state === 'FAILURE') {
    yield put(failureSearchShortFormTask());
    return;
  }

  yield put(successSearchShortFormTask({ tasks: result.data || [] }));
}

function* watchSearchShortFormTask() {
  yield takeLatest(requestSearchShortFormTask, callSearchShortFormTask);
}

// create
function* callCreateShortForm(
  action: ReturnType<typeof requestCreateShortForm>,
) {
  const { assetId, title } = action.payload;

  const result: ApiResult<ShortFormTask> = yield call(
    post,
    `/api/v1/shorts/task`,
    { assetId, title },
  );

  if (result.state === 'FAILURE') {
    yield put(failureCreateShortForm());
    return;
  }

  if (result.data) {
    yield put(successCreateShortForm(result.data));
  }
}

function* watchCreateShortForm() {
  yield takeLatest(requestCreateShortForm, callCreateShortForm);
}

// copy
function* callCopyShortForm(action: ReturnType<typeof requestCopyShortForm>) {
  const { taskId } = action.payload;

  const result: ApiResult<ShortFormTask> = yield call(
    post,
    `/api/v1/shorts/task/${taskId}/copy`,
  );

  if (result.state === 'FAILURE') {
    yield put(failureCopyShortForm());
    return;
  }

  if (result.data) {
    yield put(successCopyShortForm(result.data));
  }
}

function* watchCopyShortForm() {
  yield takeLatest(requestCopyShortForm, callCopyShortForm);
}

// remove
function* callRemoveShortForm(
  action: ReturnType<typeof requestRemoveShortForm>,
) {
  const { taskId } = action.payload;

  const result: ApiResult<{ id: string }> = yield call(
    del,
    `/api/v1/shorts/task/${taskId}`,
  );

  if (result.state === 'FAILURE') {
    yield put(faliureRemoveShortForm());
    return;
  }

  yield put(successRemoveShortForm({ taskId }));
}

function* watchRemoveShortForm() {
  yield takeLatest(requestRemoveShortForm, callRemoveShortForm);
}

export default function* shortFormSagas() {
  yield all([
    fork(watchSearchShortFormTask),
    fork(watchCreateShortForm),
    fork(watchCopyShortForm),
    fork(watchRemoveShortForm),
  ]);
}
