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

import { userActions } from '.';

// action
const {
  // logged in
  requestLoggedIn,
  successLoggedIn,
  failureLoggedIn,
} = userActions;

// logged in
function* callLoggedIn(action: ReturnType<typeof requestLoggedIn>) {
  const { userId, password } = action.payload;

  const result: ApiResult<{ accessToken: string }> = yield call(
    post,
    '/api/user/login',
    {
      clientType: 'CLIP',
      userId,
      password,
    },
  );

  yield delay(1_000);

  const accessToken = result.data?.accessToken;

  if (!accessToken || result.state !== 'SUCCESS') {
    yield put(
      failureLoggedIn({
        failureMessage: '아이디 또는 패스워드가 올바르지 않습니다.',
      }),
    );
    return;
  }

  const jwtPayload = decodeJwt(accessToken);

  const user: User = {
    id: jwtPayload['id'],
    userId: jwtPayload['userId'],
    name: jwtPayload['name'],
    email: jwtPayload['email'],
  };

  yield put(successLoggedIn(user));
}

function* watchLoggedIn() {
  yield takeLatest(requestLoggedIn, callLoggedIn);
}

export default function* userSagas() {
  yield all([fork(watchLoggedIn)]);
}
