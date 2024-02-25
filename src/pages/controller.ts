// outsource dependencies
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, call } from 'redux-saga/effects';

// local dependencies
import PUB from '@/services/api-public.ts';
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
    initialize () {},
    clear: () => initialState,
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
  },
});

export const { initialize, clear, update } = slice.actions;

const reducer = combineReducers({
  main: slice.reducer,
});

export default reducer;

export const selector = (state:AppState):State => state.root.main;

interface ControllerActions {
  clear: () => void,
  initialize: () => void,
  update: (state:Partial<State>) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    update: updateCtrl,
    initialize: initializeCtrl,
  };
};

export const useControllerState = () => useAppSelector(selector);

export const useController = ():[State, ControllerActions] => {
  const state = useControllerState();
  const actions = useControllerActions();

  return [state, actions];
};

export function * rootSubscriber () {
  yield fork(rootSagaWatcher);
}

export function * rootSagaWatcher () {
  yield takeEvery(initialize.type, initializeSaga);
  // yield takeEvery(logout.type, logoutSaga);
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
