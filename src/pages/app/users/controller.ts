// outsource dependencies
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, call } from 'redux-saga/effects';

// local dependencies
import API from '@/services/api-private.ts';
import getErrorMessage from '@/services/errors.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';

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

interface Subscription extends User {
  subscribed: boolean;
}

export interface State {
  disabled: boolean,
  error: string | null,
  initialized: boolean,
  data: Array<Subscription> | null
}

const initialState: State = {
  data: null,
  error: null,
  disabled: false,
  initialized: false,
};

const slice = createSlice({
  name: 'app/users',
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

export default slice;

export const selector = (state:AppState):State => state.root.app[slice.name];

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
}

export function * sagaWatcher () {
  yield takeEvery(initialize.type, initializeSaga);
}

function * initializeSaga () {
  try {
    const { data }:{data:Array<Subscription>} = yield call(API.get, '/users');
    yield put(update({ data }));
  } catch (error) {
    yield put(update({ error: getErrorMessage(error), initialized: true }));
    return;
  }
  yield put(update({ initialized: true, }));
}
