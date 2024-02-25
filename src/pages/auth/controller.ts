// outsource dependencies
import { fork } from 'redux-saga/effects';
import { combineReducers } from '@reduxjs/toolkit';

// local dependencies
import signUpSlice, { subscriber as signUpSubscriber } from './sign-up/controller.ts';

const reducer = combineReducers({
  [signUpSlice.name]: signUpSlice.reducer,
});

export default reducer;

export function * authSubscriber () {
  yield fork(signUpSubscriber);
}
