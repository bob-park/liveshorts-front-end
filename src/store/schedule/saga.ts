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

import { scheduleActions } from '.';

// action
const {
  // get schedule
  requestGetSchedule,
  successGetSchedule,
  failureGetSchedule,
} = scheduleActions;

// get scheudle
function* callGetSchedule(action: ReturnType<typeof requestGetSchedule>) {
  const { channelId, startDateTime, endDateTime } = action.payload;

  const result: ApiResult<RecordSchedule[]> = yield call(
    get,
    `/api/v1/record/channel/${channelId}/schedule`,
    { startDateTime, endDateTime },
  );

  yield delay(500);

  if (result.state === 'FAILURE') {
    yield put(failureGetSchedule());
    return;
  }

  yield put(successGetSchedule({ schedules: result.data || [] }));
}

function* watchGetSchedule() {
  yield takeLatest(requestGetSchedule, callGetSchedule);
}

export default function* shortFormSagas() {
  yield all([fork(watchGetSchedule)]);
}
