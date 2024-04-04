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

  // logged out
  requestLoggedOut,
  successLoggedOut,
  failureLoggedOut,

  // update me
  requestUpdateMe,
  successUpdateMe,

  // get user
  requestGetUser,
  successGetUser,
  failureGetUser,
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
    role: jwtPayload['role'],
    authorities: jwtPayload['authorities'],
  };

  yield put(successLoggedIn(user));
}

function* watchLoggedIn() {
  yield takeLatest(requestLoggedIn, callLoggedIn);
}

// logged out
function* callLoggedOut(action: ReturnType<typeof requestLoggedOut>) {
  const result: ApiResult<{}> = yield call(get, '/api/user/logout');

  if (result.state !== 'SUCCESS') {
    yield put(failureLoggedOut());
    return;
  }

  yield put(successLoggedOut());
}

function* watchLoggedOut() {
  yield takeLatest(requestLoggedOut, callLoggedOut);
}

// update me
function* updateMe(action: ReturnType<typeof requestUpdateMe>) {
  const token = action.payload;

  const jwtPayload = decodeJwt(token);

  const user: User = {
    id: jwtPayload['id'],
    userId: jwtPayload['userId'],
    name: jwtPayload['name'],
    email: jwtPayload['email'],
    role: jwtPayload['role'],
    authorities: jwtPayload['authorities'],
  };

  yield put(successUpdateMe(user));
}

function* watchUpdateMe() {
  yield takeLatest(requestUpdateMe, updateMe);
}

// get user
function* callGetUser(action: ReturnType<typeof requestGetUser>) {
  const { id } = action.payload;

  const result: ApiResult<User> = yield call(get, `/api/user/${id}`);

  if (result.state === 'FAILURE') {
    yield put(failureGetUser());
    return;
  }

  if (result.data) {
    yield put(successGetUser(result.data));
  }
}

function* watchGetUser() {
  yield takeLatest(requestGetUser, callGetUser);
}

export default function* userSagas() {
  yield all([
    fork(watchLoggedIn),
    fork(watchLoggedOut),
    fork(watchUpdateMe),
    fork(watchGetUser),
  ]);
}
