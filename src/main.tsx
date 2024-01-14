// outsource dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';

// local dependencies
import App from './App.tsx';

// styles
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
