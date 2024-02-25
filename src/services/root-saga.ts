import { fork } from 'redux-saga/effects';

import { rootSubscriber } from '@/pages/controller.ts';

export default function * sagaWatcher () {
  yield fork(rootSubscriber);
}
