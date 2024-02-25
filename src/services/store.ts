// outsource dependencies
import createSagaMiddleware, { type Task } from 'redux-saga';
import { configureStore, combineReducers, type Store } from '@reduxjs/toolkit';

// local dependencies
import sagaWatcher from './root-saga.ts';
import rootReducer from '@/pages/controller.ts';

export interface SagaStore extends Store {
  sagaTask: Task;
}

const reducer = combineReducers({
  root: rootReducer,
});

export const makeStore = () => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware
  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        // NOTE Ignore these action types because of file input that has to be put in FormData or smth else
        ignoredPaths: [],
        ignoredActions: [],
      }, })
      .concat(sagaMiddleware),
    devTools: {
      name: 'SameFame client',
    }
  });

  // 3: Run your sagas on server
  (store as SagaStore).sagaTask = sagaMiddleware.run(sagaWatcher);

  // 4: Add auth fail action
  // onAuthFail(error => store.dispatch(sessionExpiredLogout()));

  // 5: now return the store
  return store as SagaStore;
};

export default makeStore();
