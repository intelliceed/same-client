// outsource dependencies
import { memo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// constants

// local dependencies
import SignUp from './sign-up/index.tsx';
import SignIn from './sign-in/index.tsx';
import ResetPassword from './reset-password/index.tsx';
import ForgotPassword from './forgot-password/index.tsx';

const Auth = memo(() => {
  const location = useLocation();

  return <Routes>
    <Route path="login" element={<SignIn />} />
    <Route path="register" element={<SignUp />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="/*" element={<Navigate to="login" state={{ from: location }} />} />
  </Routes>;
});

export default Auth;
