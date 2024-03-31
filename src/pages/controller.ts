// outsource dependencies
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, call } from 'redux-saga/effects';

// local dependencies
import PUB from '@/services/api-public.ts';
import AuthService from '@/services/auth.ts';
import getErrorMessage from '@/services/errors.ts';
import { API_NAMES } from '@/services/api-helpers.ts';
import authReducer, { authSubscriber } from './auth/controller.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';
import appReducer, { subscriber as appSubscriber } from './app/controller.ts';
import API, { restoreSessionFromStore, setupSession } from '@/services/api-private.ts';

// configure
interface User {
  _id: string;
  lastName: string;
  firstName: string;
  location?: string | null;
  occupation?: string | null;
  picturePath?: string | null;
  impressions?: number | null;
  viewedProfile?: number | null;
}

export interface Self extends User {
  email: string;
  subscriptions: Array<User> | null;
}

export interface State {
  health: boolean,
  disabled: boolean,
  self: Self | null,
  error: string | null,
  initialized: boolean,
}

const initialState: State = {
  self: null,
  error: null,
  health: true,
  disabled: false,
  initialized: false,
};

const slice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    logout () {},
    getSelf () {},
    initialize () {},
    clear: () => initialState,
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
  },
});

export const { initialize, clear, update, logout, getSelf } = slice.actions;

const reducer = combineReducers({
  main: slice.reducer,
  auth: authReducer,
  app: appReducer,
});

export default reducer;

export const selector = (state:AppState):State => state.root.main;

interface ControllerActions {
  clear: () => void,
  logout: () => void,
  getSelf: () => void,
  initialize: () => void,
  update: (state:Partial<State>) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const handleGetSelf = useCallback(() => dispatch(getSelf()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    update: updateCtrl,
    logout: handleLogout,
    getSelf: handleGetSelf,
    initialize: initializeCtrl,
  };
};

export const useControllerState = () => useAppSelector(selector);

export const useController = ():[State, ControllerActions] => {
  const state = useControllerState();
  const actions = useControllerActions();

  return [state, actions];
};

export const useSelf = () => useControllerState().self;

export function * rootSubscriber () {
  yield fork(rootSagaWatcher);
  yield fork(authSubscriber);
  yield fork(appSubscriber);
}

export function * rootSagaWatcher () {
  yield takeEvery(initialize.type, initializeSaga);
  yield takeEvery(getSelf.type, getSelfSaga);
  yield takeEvery(logout.type, logoutSaga);
}

function * initializeSaga () {
  try {
    yield call(PUB.get, '/health');
  } catch (error) {
    yield put(update({ health: false, initialized: true }));
    return;
  }
  const hasSession:boolean = yield call(restoreSessionFromStore);
  if (hasSession) { yield call(getSelfSaga); }
  yield put(update({
    health: true,
    initialized: true,
  }));
}

function * logoutSaga () {
  try {
    const { [API_NAMES.REFRESH_TOKEN]: refreshToken } = yield call(AuthService.getToken);
    yield call(API.post, '/auth/logout', { refreshToken });
  } catch (error) {
    console.info(getErrorMessage(error));
  }
  yield call(setupSession, null);
  yield put(update({ self: null, }));
}

export function * getSelfSaga () {
  try {
    const data: Self = yield call(API.get, '/auth/me',);
    yield put(update({ self: data, }));
  } catch (error) {
    console.info(getErrorMessage(error));
  }
}
