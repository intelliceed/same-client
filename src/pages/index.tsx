// outsource dependencies
import { BrowserHistory } from 'history';
import { Navigate, Route, Router, Routes, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState, Suspense, PropsWithChildren } from 'react';

// local dependencies
import App from '@/pages/app/index.tsx';
import Home from '@/pages/home/index.tsx';
import Auth from '@/pages/auth/index.tsx';
import history from '@/services/history.ts';
import AuthService from '@/services/auth.ts';
import { useController } from './controller.ts';
import { PageLoader } from '@/components/page-loader.tsx';
import { Maintenance } from '@/components/maintenance.tsx';

export const Pages = () => {
  const [{ initialized, health, }, { initialize, clear, }] = useController();

  useEffect(() => { initialize(); }, [initialize, clear]);

  if (!initialized) { return <PageLoader/>; }
  if (!health) { return <Maintenance/>; }

  return <>
    <ConnectedRouter history={history}>
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          <Route path="auth/*" element={<Auth />} />
          <Route path="app/*" element={<RequireAuth><App /></RequireAuth>} />
          { /*<Route path={APP.RELATIVE_DEEP} element={<RequireAuth><App /></RequireAuth>} />*/ }
          { /*<Route path="/*" element={<Navigate to={APP.LINK()} />} />*/ }
          <Route path="/" element={<Home/>} />
        </Routes>
      </Suspense>
    </ConnectedRouter>
  </>;
};

export default Pages;

type ConnectedRouterProps = PropsWithChildren<{
  history: BrowserHistory,
  basename?: string
}>

const ConnectedRouter = ({ history, basename, children }:ConnectedRouterProps) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return <Router
    // history={history}
    basename={basename}
    navigator={history}
    location={state.location}
    navigationType={state.action}
  >
    { children }
  </Router>;
};

function RequireAuth ({ children }:PropsWithChildren) {
  const location = useLocation();

  if (!AuthService.isTokenExist()) { return <Navigate to="/" state={{ from: location }} replace />; }

  return children;
}
