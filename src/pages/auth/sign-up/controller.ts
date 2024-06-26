// outsource dependencies
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, call } from 'redux-saga/effects';

// local dependencies
import PUB from '@/services/api-public.ts';
import history from '@/services/history.ts';
import getErrorMessage from '@/services/errors.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';

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

export type SubmitPayload = {
  email: string,
  password: string,
  lastName: string,
  firstName: string,
  occupation: string,
  avatar: File | null,
  confirmPassword: string,
}

const slice = createSlice({
  name: 'auth/sign-up',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    initialize () {},
    clear: () => initialState,
    submit (_state, _action: {type: string, payload:SubmitPayload}) {},
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
    /* eslint-enable no-alert, no-console */
  },
});

export default slice;

export const { initialize, clear, update, submit } = slice.actions;

export const selector = (state:AppState):State => state.root.auth[slice.name];

interface ControllerActions {
  clear: () => void,
  initialize: () => void,
  update: (state:Partial<State>) => void,
  submit: (payload:SubmitPayload) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);
  const handleSubmit = useCallback((payload:SubmitPayload) => dispatch(submit(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    update: updateCtrl,
    submit: handleSubmit,
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
  yield takeEvery(submit.type, action => submitSaga(action as unknown as {type: string, payload:SubmitPayload}));
}

function * initializeSaga () {
  yield put(update({ initialized: true, }));
}

const prepareFormData = (payload:SubmitPayload) => {
  const formData = new FormData();
  formData.append('email', payload.email);
  formData.append('password', payload.password);
  formData.append('lastName', payload.lastName);
  formData.append('firstName', payload.firstName);
  formData.append('occupation', payload.occupation);
  if (!payload.avatar) { return formData; }
  formData.append('file', payload.avatar);
  return formData;
};

function * submitSaga ({ payload }:{payload: SubmitPayload}) {
  yield put(update({ disabled: true, }));
  try {
    yield call(PUB.post, '/auth/register', prepareFormData(payload), { headers: { 'Content-Type': 'multipart/form-data', }, });
    yield call(toast.success, 'You have been successfully registered. You can login now.');
    yield call(history.replace, '/auth/login');
  } catch (error) {
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false, }));
}
