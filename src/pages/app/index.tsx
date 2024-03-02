// outsource dependencies
import { memo, useCallback } from 'react';

// assets
import logo from '@/assets/logo-icon.svg';
import AuthService from '@/services/auth.ts';
import { useControllerActions } from '@/pages/controller.ts';

const AppLayout = memo(() => {
  const { update } = useControllerActions();

  const logout = useCallback(() => {
    update({ self: null });
    AuthService.removeToken();
  }, [update]);

  return <div className="flex w-full h-full items-center justify-center min-h-screen flex-col gap-y-4">
    <img src={logo} alt="" width={300} height={300} className="animate-pulse"/>
    <button className="btn-secondary" type="button" onClick={logout}>Logout</button>
  </div>;
});

export default AppLayout;
