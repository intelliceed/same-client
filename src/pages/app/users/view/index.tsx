// outsource dependencies
import { format } from 'date-fns';
// import toast from 'react-hot-toast';
import { memo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, } from '@heroicons/react/24/solid';
import { BriefcaseIcon, CursorArrowRaysIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';

// local dependencies
import config from '@/constants/config.ts';
import { useController } from './controller.ts';
import { Spinner } from '@/components/spinner.tsx';
import { PageLoader } from '@/components/page-loader.tsx';

// assets
import userImage from '@/assets/user.png';

const UsersLayout = memo(() => {
  const { id } = useParams();
  const [{ initialized, data, disabled, postsList }, { initialize, toggleFollow, clear }] = useController();

  useEffect(() => {
    initialize({ id: id || '' }); return clear;
  }, [clear, id, initialize]);

  if (!initialized) { return <PageLoader/>; }

  return <>
    <main className="w-full min-h-screen bg-gray-100">
      <div className="container mx-auto flex w-full min-h-screen flex-col pt-[80px] bg-gray-100">
        <div className="pt-6 mb-2">
          <Link to="/app" className="flex items-center min-w-max ml-auto p-1 text-main hover:text-main/70 transition gap-x-1">
            <ArrowLeftIcon className="w-4 h-4"/>
            Back to my profile
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-3 ">
            <div className="p-4 bg-white rounded-lg shadow sticky top-[104px]">
              <div className="flex gap-x-2 items-start mb-3">
                <img src={!data?.picturePath ? userImage : `${config('API_URL', '')}/${data?.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
                <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
                  <h2 className="font-semibold truncate min-w-0">{ data?.firstName || '' } { data?.lastName || '' }</h2>
                </div>
              </div>
              <hr className="mb-3"/>
              <div className="flex items-center text-sm gap-x-3 mb-3">
                <div>
                  <MapPinIcon className="w-5 h-5"/>
                </div>
                <h3 className="break-words">{ data?.location || 'Location not specified' }</h3>
              </div>
              <div className="flex items-center text-sm gap-x-3 mb-2">
                <div>
                  <BriefcaseIcon className="w-5 h-5"/>
                </div>
                <h3 className="break-words">{ data?.occupation || 'Occupation not specified' }</h3>
              </div>
              <hr className="mb-3"/>
              <div className="flex items-center text-sm gap-x-3 mb-3">
                <div>
                  <EyeIcon className="w-5 h-5"/>
                </div>
                <div className="flex items-center min-w-0 justify-between grow">
                  <h3 className="truncate min-w-0">Profile views</h3>
                  <p className="font-medium">{ data?.viewedProfile || 0 }</p>
                </div>
              </div>
              <div className="flex items-center text-sm gap-x-3 mb-3">
                <div>
                  <CursorArrowRaysIcon className="w-5 h-5"/>
                </div>
                <div className="flex items-center min-w-0 justify-between grow">
                  <h3 className="truncate min-w-0">Profile impressions</h3>
                  <p className="font-medium">{ data?.impressions || 0 }</p>
                </div>
              </div>
            </div>


          </div>
          <div className="col-span-6">
            { !postsList.length ? <div className="p-4 bg-white rounded-lg shadow mb-4"><p className="font-medium">There are no posts. The user can post only for subscribers, so try to follow</p></div> : postsList.map(item => <div key={item._id} className="p-4 bg-white rounded-lg shadow mb-4">
              <div className="flex gap-x-2 items-start mb-3">
                <img src={!item.user.picturePath ? userImage : `${config('API_URL', '')}/${item.user.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
                <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
                  <p className="font-medium truncate min-w-0 text-sm">{ item.user.firstName || '' } { item.user.lastName || '' }</p>
                  <p className="text-xs text-gray-500">{ format(new Date(item.createdAt), 'MM.dd.yyyy HH:mm') }</p>
                </div>
              </div>
              <p className="mb-3">{ item.content }</p>
              { !item.picturePath ? null : <div>
                <img src={`${config('API_URL', '')}/${item.picturePath}`} alt="post image" width="300" height="400" className="rounded max-h-[400px] max-w-[300px]"/>
              </div> }
            </div>) }

          </div>
          <div className="col-span-3">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Subscription status</h3>
              <p className="mb-4">Subscription makes it possible to view user posts that are available only to his subscribers</p>
              <button type="button" onClick={() => toggleFollow()} className="btn bg-main text-center text-white w-full hover:bg-main/70 active:bg-main/50 flex justify-center">{ !disabled ? !data?.subscribed ? 'Follow' : 'Unsubscribe' : <Spinner className="w-5 h-5 fill-white text-transparent animate-spin"/> }</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>;


});

export default UsersLayout;
