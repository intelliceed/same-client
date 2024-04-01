// outsource dependencies
import { Fragment, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';

// local dependencies
import { useControllerActions, useSelf } from '@/pages/controller.ts';

// assets
import logo from '@/assets/logo-icon.svg';
import userImage from '@/assets/user.png';

const Navbar = memo(() => {
  const self = useSelf();
  const { logout } = useControllerActions();


  return <nav className="bg-blue-300 p-4 fixed top-0 w-full h-[80px] z-10">
    <div className="container mx-auto flex justify-between items-center gap-x-2">
      <div className="flex items-center gap-x-2 min-w-max">
        <img src={logo} alt="samefame" width="30" height="30" className=""/>
        <h1 className="text-xl font-semibold text-tertiary">SameFame</h1>
      </div>
      { !self
        ? <Link to="/auth/login" className="btn text-secondary transition-all font-semibold rounded border-secondary hover:bg-secondary/10 border-2 active:bg-secondary/20 text-base">Login</Link>
        : <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex min-w-0 items-center gap-x-4 rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              <div className="truncate min-w-0">{ self?.firstName || '' } { self?.lastName || '' }</div>
              <img src={self?.picturePath || userImage} alt="User avatar" width="32" height="32" className="rounded-full border-2 border-tertiary object-cover"/>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  { ({ active }) => <Link to="/app" className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} transition group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      My page
                  </Link> }
                </Menu.Item>
                <Menu.Item>
                  { ({ active }) => <button type="button" onClick={() => logout()} className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} transition group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      Logout
                  </button> }
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu> }
    </div>
  </nav>;
});

export default Navbar;
