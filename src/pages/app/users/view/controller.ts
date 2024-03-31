// outsource dependencies
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, call, select } from 'redux-saga/effects';

// local dependencies
import API from '@/services/api-private.ts';
import getErrorMessage from '@/services/errors.ts';
import { Self, update as updateRoot } from '@/pages/controller.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';

// configure
interface User {
  _id: string;
  lastName: string;
  firstName: string;
  subscribed: boolean;
  location?: string | null;
  occupation?: string | null;
  picturePath?: string | null;
  impressions?: number | null;
  viewedProfile?: number | null;
}

export interface State {
  disabled: boolean,
  data: User | null,
  error: string | null,
  initialized: boolean,
}

const initialState: State = {
  data: null,
  error: null,
  disabled: false,
  initialized: false,
};

const slice = createSlice({
  name: 'app/users/view',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    toggleFollow () {},
    clear: () => initialState,
    initialize (_state, _action: {type: string, payload:{id: string}}) {},
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
    /* eslint-enable no-alert, no-console */
  },
});

export const { initialize, clear, update, toggleFollow } = slice.actions;

export default slice;

export const selector = (state:AppState):State => state.root.app[slice.name];

interface ControllerActions {
  clear: () => void,
  toggleFollow: () => void,
  update: (state:Partial<State>) => void,
  initialize: (payload:{id:string}) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const handleToggleFollow = useCallback(() => dispatch(toggleFollow()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);
  const initializeCtrl = useCallback((payload:{id:string}) => dispatch(initialize(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    update: updateCtrl,
    initialize: initializeCtrl,
    toggleFollow: handleToggleFollow,
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
  yield takeEvery(toggleFollow.type, toggleFollowSaga);
  yield takeEvery(initialize.type, action => initializeSaga(action as unknown as {type: string, payload:{id:string}}));
}

function * initializeSaga ({ payload }:{payload:{id:string}}) {
  try {
    const { data }:{data:User} = yield call(API.get, `/users/${payload.id}`,);
    yield put(update({ data }));
  } catch (error) {
    yield put(update({ error: getErrorMessage(error), initialized: true }));
    return;
  }
  yield put(update({ initialized: true, }));
}

function * toggleFollowSaga () {
  yield put(update({ disabled: true }));
  const { data } = yield select(selector);
  try {
    try {
      yield put(update({ data: { ...data, subscribed: !data.subscribed } }));
      const { data: self }:{data: Self} = yield call(API.post, `/users/${data._id}/toggle-follow`, { subscribed: !data.subscribed });
      yield put(updateRoot({ self }));
    } catch (error) {
      yield put(update({ data }));
      throw error;
    }
  } catch (error) {
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false }));
}
