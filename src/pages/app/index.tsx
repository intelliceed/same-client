// outsource dependencies
// import toast from 'react-hot-toast';
import { memo } from 'react';

// local dependencies
import Navbar from '@/components/navbar.tsx';
import { useSelf } from '@/pages/controller.ts';

// assets
import userImage from '@/assets/user.png';
import { BriefcaseIcon, CursorArrowRaysIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const AppLayout = memo(() => {
  const self = useSelf();
  // const { logout } = useControllerActions();

  return <>
    <Navbar/>
    <main className="w-full min-h-screen bg-gray-100">
      <div className="container mx-auto flex w-full min-h-screen flex-col pt-[64px] bg-gray-100">
        <div className="pt-6 grid grid-cols-12 gap-x-6">
          <div className="col-span-3 p-4 bg-white rounded-lg shadow">
            <div className="flex gap-x-2 items-start mb-3">
              <img src={self?.picturePath || userImage} alt="user avatar" width="48" height="48" className="rounded-full object-cover"/>
              <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
                <h2 className="font-semibold truncate min-w-0">{ self?.firstName || '' } { self?.lastName || '' }</h2>
                <button>asd</button>
              </div>
            </div>
            <hr className="mb-3"/>
            <div className="flex items-center text-sm gap-x-3 mb-3">
              <MapPinIcon className="w-5 h-5"/>
              <h3 className="break-words">{ self?.location || 'Location not specified' }</h3>
            </div>
            <div className="flex items-center text-sm gap-x-3 mb-2">
              <BriefcaseIcon className="w-5 h-5"/>
              <h3 className="break-words">{ self?.occupation || 'Occupation not specified' }</h3>
            </div>
            <hr className="mb-3"/>
            <div className="flex items-center text-sm gap-x-3 mb-3">
              <EyeIcon className="w-5 h-5"/>
              <div className="flex items-center min-w-0 justify-between grow">
                <h3 className="truncate min-w-0">Profile views</h3>
                <p className="font-medium">{ self?.viewedProfile || 0 }</p>
              </div>
            </div>
            <div className="flex items-center text-sm gap-x-3 mb-3">
              <CursorArrowRaysIcon className="w-5 h-5"/>
              <div className="flex items-center min-w-0 justify-between grow">
                <h3 className="truncate min-w-0">Profile impressions</h3>
                <p className="font-medium">{ self?.impressions || 0 }</p>
              </div>
            </div>


          </div>
          <div className="col-span-6 p-4 bg-white rounded-lg shadow">

          </div>
          <div className="col-span-3 p-4 bg-white rounded-lg shadow">

          </div>


        </div>
      </div>
    </main>
  </>;


});

export default AppLayout;
