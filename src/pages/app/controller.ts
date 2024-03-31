// outsource dependencies
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { takeEvery, put, fork, } from 'redux-saga/effects';
import { combineReducers, createSlice } from '@reduxjs/toolkit';

// local dependencies
// import API from '@/services/api-private.ts';
import getErrorMessage from '@/services/errors.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';
import usersSlice, { subscriber as usersSubscriber } from './users/controller.ts';
import usersViewSlice, { subscriber as usersViewSubscriber } from './users/view/controller.ts';

// configure
export interface State {
  disabled: boolean,
  error: string | null,
  initialized: boolean,
}

const initialState: State = {
  error: null,
  disabled: false,
  initialized: false,
};

const slice = createSlice({
  name: 'app/main',
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

export const { initialize, clear, update, } = slice.actions;

const reducer = combineReducers({
  main: slice.reducer,
  [usersSlice.name]: usersSlice.reducer,
  [usersViewSlice.name]: usersViewSlice.reducer
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


export function * subscriber () {
  yield fork(sagaWatcher);
  yield fork(usersSubscriber);
  yield fork(usersViewSubscriber);
}

export function * sagaWatcher () {
  yield takeEvery(initialize.type, initializeSaga);
}

function * initializeSaga () {
  try {
    // const { data } = yield call(API.get, '/users');
  } catch (error) {
    yield put(update({ error: getErrorMessage(error), initialized: true }));
    return;
  }
  yield put(update({ initialized: true, }));
}
