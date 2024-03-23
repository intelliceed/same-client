// outsource dependencies
import toast from 'react-hot-toast';
import { memo, useCallback } from 'react';

// assets
import logo from '@/assets/logo-icon.svg';
import API from '@/services/api-private.ts';
import getErrorMessage from '@/services/errors.ts';
import { useControllerActions } from '@/pages/controller.ts';

const AppLayout = memo(() => {
  const { logout } = useControllerActions();

  const handleGetSelf = useCallback(async () => {
    try {
      const response = await API({ url: '/auth/me', method: 'GET' });
      console.log(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, []);

  return <div className="flex w-full h-full items-center justify-center min-h-screen flex-col gap-y-4">
    <img src={logo} alt="" width={300} height={300} className="animate-pulse"/>
    <button type="button" onClick={handleGetSelf} className="btn-primary">Get Self</button>
    <button className="btn-secondary" type="button" onClick={logout}>Logout</button>
  </div>;
});

export default AppLayout;
