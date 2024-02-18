// outsource dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';

// local dependencies
import App from './App.tsx';

// styles
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
