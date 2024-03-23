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
import API, { setupSession } from '@/services/api-private.ts';
import authReducer, { authSubscriber } from './auth/controller.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';

// configure
export interface State {
  health: boolean,
  disabled: boolean,
  self: object | null,
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
    initialize () {},
    clear: () => initialState,
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
  },
});

export const { initialize, clear, update, logout } = slice.actions;

const reducer = combineReducers({
  main: slice.reducer,
  auth: authReducer,
});

export default reducer;

export const selector = (state:AppState):State => state.root.main;

interface ControllerActions {
  clear: () => void,
  logout: () => void,
  initialize: () => void,
  update: (state:Partial<State>) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    update: updateCtrl,
    logout: handleLogout,
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
}

export function * rootSagaWatcher () {
  yield takeEvery(initialize.type, initializeSaga);
  yield takeEvery(logout.type, logoutSaga);
}

function * initializeSaga () {
  try {
    yield call(PUB.get, '/health');
  } catch (error) {
    yield put(update({ health: false, initialized: true }));
    return;
  }
  // const hasSession = yield call(restoreSessionFromStore);
  // if (hasSession) {
  //   yield call(history.replace, APP.REGEXP.test(history.location.pathname)
  //     ? history.location
  //     : APP.LINK());
  // }
  // yield call(registerLocale, 'en', en);
  // yield call(registerLocale, 'de', de);
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
