// outsource dependencies
import { memo } from 'react';
import { Link } from 'react-router-dom';

// local dependencies
import { useSelf } from '@/pages/controller.ts';

// assets
import logo from '@/assets/logo-icon.svg';
import userImage from '@/assets/user.png';

const Navbar = memo(() => {
  const self = useSelf();

  return <nav className="bg-blue-300 p-4 fixed top-0 w-full">
    <div className="container mx-auto flex justify-between items-center gap-x-2">
      <div className="flex items-center gap-x-2 min-w-max">
        <img src={logo} alt="samefame" width="30" height="30" className=""/>
        <h1 className="text-xl font-semibold text-tertiary">SameFame</h1>
      </div>
      { !self
        ? <Link to="/auth/login" className="btn text-secondary transition-all font-semibold rounded border-secondary hover:bg-secondary/10 border-2 active:bg-secondary/20 text-base">Login</Link>
        : <Link to="/app" className="flex min-w-0 items-center gap-x-4">
          <div className="truncate min-w-0">{ self?.firstName || '' } { self?.lastName || '' }</div>
          <img src={self?.picturePath || userImage} alt="User avatar" width="32" height="32" className="rounded-full border-2 border-tertiary object-cover"/>
        </Link> }
    </div>
  </nav>;
});

export default Navbar;
