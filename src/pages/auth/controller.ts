// outsource dependencies
import { fork } from 'redux-saga/effects';
import { combineReducers } from '@reduxjs/toolkit';

// local dependencies
import signUpSlice, { subscriber as signUpSubscriber } from './sign-up/controller.ts';
import signInSlice, { subscriber as signInSubscriber } from './sign-in/controller.ts';

const reducer = combineReducers({
  [signUpSlice.name]: signUpSlice.reducer,
  [signInSlice.name]: signInSlice.reducer,
});

export default reducer;

export function * authSubscriber () {
  yield fork(signUpSubscriber);
  yield fork(signInSubscriber);
}
