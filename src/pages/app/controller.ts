// outsource dependencies
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { takeEvery, put, fork, select, call } from 'redux-saga/effects';

// local dependencies
// import API from '@/services/api-private.ts';
import API from '@/services/api-private.ts';
import getErrorMessage from '@/services/errors.ts';
import { AppState, useAppSelector } from '@/services/store-helpers.ts';
import usersSlice, { subscriber as usersSubscriber } from './users/controller.ts';
import usersViewSlice, { subscriber as usersViewSubscriber } from './users/view/controller.ts';

// configure
interface Post {
  _id: string,
  user: string,
  content: string,
  createdAt: string,
  picturePath?: string,
  forSubscribers: boolean,
}

export interface State {
  disabled: boolean,
  postContent: string,
  error: string | null,
  initialized: boolean,
  postsList: Array<Post>,
  forSubscribers: boolean,
}

const initialState: State = {
  error: null,
  postsList: [],
  disabled: false,
  postContent: '',
  initialized: false,
  forSubscribers: false,
};

const slice = createSlice({
  name: 'app/main',
  initialState,
  reducers: {
    post () {},
    initialize () {},
    clear: () => initialState,
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
  },
});

export const { initialize, clear, update, post } = slice.actions;

const reducer = combineReducers({
  main: slice.reducer,
  [usersSlice.name]: usersSlice.reducer,
  [usersViewSlice.name]: usersViewSlice.reducer
});

export default reducer;

export const selector = (state:AppState):State => state.root.app.main;

interface ControllerActions {
  post: () => void,
  clear: () => void,
  initialize: () => void,
  update: (state:Partial<State>) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const handlePost = useCallback(() => dispatch(post()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    post: handlePost,
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
  yield takeEvery(post.type, postSaga);
  yield takeEvery(initialize.type, initializeSaga);
}

function * initializeSaga () {
  try {
    const { data }:{data: Array<Post>} = yield call(API.get, '/posts/my');
    yield put(update({ postsList: data }));
  } catch (error) {
    yield put(update({ error: getErrorMessage(error), initialized: true }));
    return;
  }
  yield put(update({ initialized: true, }));
}

function * postSaga () {
  yield put(update({ disabled: true }));
  try {
    const { postContent, forSubscribers, postsList }:State = yield select(selector);
    const { data }:{data:Post} = yield call(API.post, '/posts', { content: postContent, forSubscribers });
    yield put(update({ postsList: [data, ...postsList], postContent: '' }));
    yield call(toast.success, 'New post were created');
  } catch (error) {
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false }));
}
