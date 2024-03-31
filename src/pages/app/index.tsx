// outsource dependencies
// import toast from 'react-hot-toast';
import { memo, useEffect } from 'react';
import { UsersIcon } from '@heroicons/react/24/solid';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { BriefcaseIcon, CursorArrowRaysIcon, EyeIcon, MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// local dependencies
import Users from './users/index.tsx';
import Navbar from '@/components/navbar.tsx';
import UsersView from './users/view/index.tsx';
import { useSelf } from '@/pages/controller.ts';
import { useController } from './controller.ts';
import { PageLoader } from '@/components/page-loader.tsx';

// assets
import userImage from '@/assets/user.png';

const AppOutlet = memo(() => {

  return <>
    <Navbar/>
    <Routes>
      <Route path="users">
        <Route path=":id" element={<UsersView />}/>
        <Route path="" element={<Users />}/>
      </Route>
      <Route path="/" element={<AppLayout/>} />
      <Route path="/*" element={<Navigate to="/app"/>} />
    </Routes>
  </>;
});

const AppLayout = memo(() => {
  const self = useSelf();
  const [{ initialized }, { initialize, clear }] = useController();

  useEffect(() => {
    initialize(); return clear;
  }, [clear, initialize]);

  if (!initialized) { return <PageLoader/>; }

  return <main className="w-full min-h-screen bg-gray-100">
    <div className="container mx-auto flex w-full min-h-screen flex-col pt-[64px] bg-gray-100">
      <div className="pt-6 grid grid-cols-12 gap-x-6">
        <div className="col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="flex gap-x-2 items-start mb-3">
            <img src={self?.picturePath || userImage} alt="user avatar" width="48" height="48" className="rounded-full object-cover"/>
            <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
              <h2 className="font-semibold truncate min-w-0">{ self?.firstName || '' } { self?.lastName || '' }</h2>
              <button type="button" className="btn-primary !p-1"><PencilSquareIcon className="w-5 h-5"/></button>
            </div>
          </div>
          <hr className="mb-3"/>
          <div className="flex items-center text-sm gap-x-3 mb-3">
            <div>
              <MapPinIcon className="w-5 h-5"/>
            </div>
            <h3 className="break-words">{ self?.location || 'Location not specified' }</h3>
          </div>
          <div className="flex items-center text-sm gap-x-3 mb-2">
            <div>
              <BriefcaseIcon className="w-5 h-5"/>
            </div>
            <h3 className="break-words">{ self?.occupation || 'Occupation not specified' }</h3>
          </div>
          <hr className="mb-3"/>
          <div className="flex items-center text-sm gap-x-3 mb-3">
            <div>
              <EyeIcon className="w-5 h-5"/>
            </div>
            <div className="flex items-center min-w-0 justify-between grow">
              <h3 className="truncate min-w-0">Profile views</h3>
              <p className="font-medium">{ self?.viewedProfile || 0 }</p>
            </div>
          </div>
          <div className="flex items-center text-sm gap-x-3 mb-3">
            <div>
              <CursorArrowRaysIcon className="w-5 h-5"/>
            </div>
            <div className="flex items-center min-w-0 justify-between grow">
              <h3 className="truncate min-w-0">Profile impressions</h3>
              <p className="font-medium">{ self?.impressions || 0 }</p>
            </div>
          </div>


        </div>
        <div className="col-span-6 p-4 bg-white rounded-lg shadow">

        </div>
        <div className="col-span-3">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex gap-x-3 items-center mb-4">
              <h3 className="text-lg font-medium">Your subscriptions</h3>
              <Link to="/app/users" className="btn-primary !p-1 ml-auto"><UsersIcon className="w-5 h-5"/></Link>
            </div>
            { !self?.subscriptions?.length ? <p>you don&apos;t have one yet</p> : (self?.subscriptions || []).map(item => <Link to={`/app/users/${item._id}`} key={item._id} className="flex gap-x-2 items-start mb-3 p-2 border border-gray-200 rounded-md shadow transition hover:shadow-md">
              <img src={item?.picturePath || userImage} alt="user avatar" width="48" height="48" className="rounded-full object-cover"/>
              <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
                <h2 className="font-semibold truncate min-w-0">{ item?.firstName || '' } { item?.lastName || '' }</h2>
              </div>
            </Link>) }
          </div>

        </div>
      </div>
    </div>
  </main>;


});

export default AppOutlet;
