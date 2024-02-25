// outsource dependencies
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// local dependencies
import Pages from './pages/index.tsx';
import store from '@/services/store.ts';

// assets

// configure
function App () {

  return <Provider store={store}>
    <Pages/>
    <Toaster
      position="top-right"
      containerClassName="z-50"
      toastOptions={{
        duration: 5e3,
        className: 'text-sm',
      }}
    />
    <div id="menu-portal"/>
  </Provider>;
}

export default App;
