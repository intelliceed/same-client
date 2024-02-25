// outsource dependencies
import { BrowserHistory } from 'history';
import { Route, Router, Routes } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState, Suspense, PropsWithChildren } from 'react';

// local dependencies
import history from '@/services/history.ts';
import AppLayout from '@/pages/app/index.tsx';
import AuthLayout from '@/pages/auth/index.tsx';
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
          { /*<Route path={AUTH.RELATIVE_DEEP} element={<Auth />} />*/ }
          { /*<Route path={APP.RELATIVE_DEEP} element={<RequireAuth><App /></RequireAuth>} />*/ }
          { /*<Route path="/*" element={<Navigate to={APP.LINK()} />} />*/ }
          <Route path="/" element={<AppLayout/>} />
          <Route path="/auth" element={<AuthLayout/>} />
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

// function RequireAuth ({ children }:PropsWithChildren) {
//   const location = useLocation();
//
//   if (!AuthService.isTokenExist()) { return <Navigate to={SIGN_IN.LINK()} state={{ from: location }} replace />; }
//
//   return children;
// }
