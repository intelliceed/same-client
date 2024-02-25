// outsource dependencies
import { memo } from 'react';
import { Link } from 'react-router-dom';

// assets
import logo from '@/assets/logo-icon.svg';

const AppLayout = memo(() => {

  return <div className="flex w-full h-full items-center justify-center min-h-screen">
    app
    <Link to="/auth">
      <img src={logo} alt="" width={300} height={300} className="animate-pulse"/>
    </Link>
  </div>;
});

export default AppLayout;
