// outsource dependencies
import { fork } from 'redux-saga/effects';
import { combineReducers } from '@reduxjs/toolkit';

// local dependencies
import signUpSlice, { subscriber as signUpSubscriber } from './sign-up/controller.ts';
import signInSlice, { subscriber as signInSubscriber } from './sign-in/controller.ts';
import resetPasswordSlice, { subscriber as resetPasswordSubscriber } from './reset-password/controller.ts';
import forgotPasswordSlice, { subscriber as forgotPasswordSubscriber } from './forgot-password/controller.ts';

const reducer = combineReducers({
  [signUpSlice.name]: signUpSlice.reducer,
  [signInSlice.name]: signInSlice.reducer,
  [forgotPasswordSlice.name]: forgotPasswordSlice.reducer,
  [resetPasswordSlice.name]: resetPasswordSlice.reducer,
});

export default reducer;

export function * authSubscriber () {
  yield fork(signUpSubscriber);
  yield fork(signInSubscriber);
  yield fork(resetPasswordSubscriber);
  yield fork(forgotPasswordSubscriber);
}
