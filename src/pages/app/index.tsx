// outsource dependencies
import { memo, useCallback } from 'react';

// assets
import logo from '@/assets/logo-icon.svg';
import API from '@/services/api-private.ts';
import AuthService from '@/services/auth.ts';
import { API_NAMES } from '@/services/api-helpers.ts';
import { useControllerActions } from '@/pages/controller.ts';

const AppLayout = memo(() => {
  const { update } = useControllerActions();

  const logout = useCallback(async () => {
    try {
      API.post('/auth/logout', { refreshToken: AuthService.getToken()?.[API_NAMES.REFRESH_TOKEN] || null });
    } catch (error) {
      console.info(error);
    }
    update({ self: null });
    AuthService.removeToken();
  }, [update]);

  return <div className="flex w-full h-full items-center justify-center min-h-screen flex-col gap-y-4">
    <img src={logo} alt="" width={300} height={300} className="animate-pulse"/>
    <button className="btn-secondary" type="button" onClick={logout}>Logout</button>
  </div>;
});

export default AppLayout;
