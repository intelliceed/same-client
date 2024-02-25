// outsource dependencies
import { memo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// constants

// local dependencies
import SignUp from './sign-up/index.tsx';

const Auth = memo(() => {
  const location = useLocation();

  return <Routes>
    <Route path="register" element={<SignUp />} />
    <Route path="/*" element={<Navigate to="register" state={{ from: location }} />} />
  </Routes>;
});

export default Auth;
