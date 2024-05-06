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
export interface Post {
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
  postImage: File | null,
  postsList: Array<Post>,
  forSubscribers: boolean,
}

export type UpdatePayload = {
  _id: string,
  content: string,
  forSubscribers: boolean,
}

const initialState: State = {
  error: null,
  postsList: [],
  postImage: null,
  disabled: false,
  postContent: '',
  initialized: false,
  forSubscribers: false,
};

const slice = createSlice({
  name: 'app/main',
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    post () {},
    initialize () {},
    clear: () => initialState,
    updatePost (_state, _action: {type: string, payload:UpdatePayload}) {},
    deletePost (_state, _action: {type: string, payload:{_id:string}}) {},
    update: (state, action:{type: string, payload:Partial<State>}) => ({
      ...state,
      ...action.payload
    }),
    /* eslint-enable no-alert */
  },
});

export const { initialize, clear, update, post, updatePost, deletePost } = slice.actions;

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
  deletePost: (payload:{_id:string}) => void,
  updatePost: (payload:UpdatePayload) => void,
}

export const useControllerActions = ():ControllerActions => {
  const dispatch = useDispatch();
  const clearCtrl = useCallback(() => dispatch(clear()), [dispatch]);
  const handlePost = useCallback(() => dispatch(post()), [dispatch]);
  const initializeCtrl = useCallback(() => dispatch(initialize()), [dispatch]);
  const updateCtrl = useCallback((payload:Partial<State>) => dispatch(update(payload)), [dispatch]);
  const handleDeletePost = useCallback((payload:{_id:string}) => dispatch(deletePost(payload)), [dispatch]);
  const handleUpdatePost = useCallback((payload:UpdatePayload) => dispatch(updatePost(payload)), [dispatch]);

  return {
    clear: clearCtrl,
    post: handlePost,
    update: updateCtrl,
    initialize: initializeCtrl,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
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
  yield takeEvery(updatePost.type, action => updatePostSaga(action as unknown as {type: string, payload:UpdatePayload}));
  yield takeEvery(deletePost.type, action => deletePostSaga(action as unknown as {type: string, payload:{_id:string}}));
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

const prepareFormData = (payload:{postImage: File | null, postContent: string, forSubscribers: boolean}) => {
  const formData = new FormData();
  formData.append('content', payload.postContent);
  formData.append('forSubscribers', String(payload.forSubscribers));
  if (!payload.postImage) { return formData; }
  formData.append('file', payload.postImage,);
  return formData;
};

function * postSaga () {
  yield put(update({ disabled: true }));
  try {
    const { postContent, forSubscribers, postsList, postImage }:State = yield select(selector);
    const { data }:{data:Post} = yield call(API.post, '/posts', prepareFormData({ postContent, forSubscribers, postImage }), { headers: { 'Content-Type': 'multipart/form-data', }, });
    yield put(update({ postsList: [data, ...postsList], postContent: '', postImage: null }));
    yield call(toast.success, 'New post were created');
  } catch (error) {
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false }));
}

function * updatePostSaga ({ payload }:{payload:UpdatePayload}) {
  yield put(update({ disabled: true }));
  const { postsList }:State = yield select(selector);
  const postIndex = postsList.findIndex(item => item._id === payload._id);
  try {
    if (postIndex === -1) { throw new Error('Unable to find post info'); }
    yield put(update({ postsList: postsList.map((item, index) => index !== postIndex ? item : { ...item, ...payload }) }));
    yield call(API.put, `/posts/${payload._id}`, { ...payload, _id: undefined });
    yield call(toast.success, 'Post was updated');
  } catch (error) {
    yield put(update({ postsList }));
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false }));
}

function * deletePostSaga ({ payload }:{payload:{_id:string}}) {
  yield put(update({ disabled: true }));
  const { postsList }:State = yield select(selector);
  const postIndex = postsList.findIndex(item => item._id === payload._id);
  try {
    if (postIndex === -1) { throw new Error('Unable to find post info'); }
    yield put(update({ postsList: postsList.filter((_, index) => index !== postIndex) }));
    yield call(API.delete, `/posts/${payload._id}`,);
    yield call(toast.success, 'Post was deleted');
  } catch (error) {
    yield put(update({ postsList }));
    yield call(toast.error, getErrorMessage(error));
  }
  yield put(update({ disabled: false }));
}
