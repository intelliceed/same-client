// outsource dependencies
import { useState } from 'react';

// local dependencies
import { Temp } from '@/temp';
import { TempComponent } from '@/components/temp.tsx';

// assets
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';

// styles
import './App.css';

// configure
function App () {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is { count }
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Temp/>
      <TempComponent/>
    </>
  );
}

export default App;
