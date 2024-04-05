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

  // update
  requestUpdateShortForm,
  successUpdateShortForm,
  failureUpdateShortForm,

  // copy
  requestCopyShortForm,
  successCopyShortForm,
  failureCopyShortForm,

  // remove
  requestRemoveShortForm,
  successRemoveShortForm,
  faliureRemoveShortForm,

  // create extra
  requestCreateExtra,
  successCreateExtra,
  failureCreateExtra,

  // get shortform
  requestGetShortForm,
  successGetShortForm,
  failureGetShortForm,
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
  const { assetId, body, handleAfter } = action.payload;

  const result: ApiResult<ShortFormTask> = yield call(
    post,
    `/api/v1/shorts/task`,
    { assetId, title: body.title },
  );

  if (result.state === 'FAILURE') {
    yield put(failureCreateShortForm());
    return;
  }

  if (result.data) {
    yield put(successCreateShortForm(result.data));

    handleAfter && handleAfter(result.data.id);
  }
}

function* watchCreateShortForm() {
  yield takeLatest(requestCreateShortForm, callCreateShortForm);
}

// update
function* callUpdateShortForm(
  action: ReturnType<typeof requestUpdateShortForm>,
) {
  const { taskId, body, handleAfter } = action.payload;

  const result: ApiResult<ShortFormTask> = yield call(
    putCall,
    `/api/v1/shorts/task/${taskId}`,
    body,
  );

  if (result.state === 'FAILURE') {
    yield put(failureUpdateShortForm());
    return;
  }

  if (result.data) {
    yield put(successUpdateShortForm(result.data));

    handleAfter && handleAfter();
  }
}

function* watchUpdateShortForm() {
  yield takeLatest(requestUpdateShortForm, callUpdateShortForm);
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

// create extra
function* callCreateExtra(action: ReturnType<typeof requestCreateExtra>) {
  const { taskId, extraTypeIds } = action.payload;

  const response: ApiResult<ShortFormTask> = yield call(
    post,
    `/api/v1/shorts/task/${taskId}/extra`,
    { extraTypeIds },
  );

  if (response.state === 'FAILURE') {
    yield put(failureCreateExtra());
    return;
  }

  if (response.data) {
    yield put(successCreateExtra(response.data));
  }
}

function* watchCreateExtra() {
  yield takeLatest(requestCreateExtra, callCreateExtra);
}

// get shortform
function* callGetShortForm(action: ReturnType<typeof requestGetShortForm>) {
  const { taskId } = action.payload;

  const response: ApiResult<ShortFormTask> = yield call(
    get,
    `/api/v1/shorts/task/${taskId}`,
  );

  if (response.state === 'FAILURE') {
    yield put(failureGetShortForm());
    return;
  }

  if (response.data) {
    yield put(successGetShortForm(response.data));
  }
}

function* watchGetShortForm() {
  yield takeLatest(requestGetShortForm, callGetShortForm);
}

export default function* shortFormSagas() {
  yield all([
    fork(watchSearchShortFormTask),
    fork(watchCreateShortForm),
    fork(watchUpdateShortForm),
    fork(watchCopyShortForm),
    fork(watchRemoveShortForm),
    fork(watchCreateExtra),
    fork(watchGetShortForm),
  ]);
}
