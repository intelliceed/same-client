// outsource dependencies
import cn from 'classnames';
// import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { memo, useEffect } from 'react';
import { ArrowRightIcon, CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/solid';

// local dependencies
import { useController } from './controller.ts';
import { PageLoader } from '@/components/page-loader.tsx';

// assets
import userImage from '@/assets/user.png';

const UsersLayout = memo(() => {
  const [{ initialized, data }, { initialize, clear }] = useController();

  useEffect(() => {
    initialize(); return clear;
  }, [clear, initialize]);

  if (!initialized) { return <PageLoader/>; }

  return <>
    <main className="w-full min-h-screen bg-gray-100">
      <div className="container mx-auto flex w-full min-h-screen flex-col pt-[80px] bg-gray-100">
        <div className="pt-6 flex flex-col gap-y-4">
          { !data?.length ? <h3>There are no users created yet</h3> : <>
            <h3 className="text-lg font-medium">Users to follow</h3>
            { data.map(item => <div key={item._id} className="p-4 bg-white rounded-lg shadow">
              <div key={item._id} className="flex gap-x-2 items-start mb-3">
                <img src={item?.picturePath || userImage} alt="user avatar" width="48" height="48" className="rounded-full object-cover"/>
                <div className="flex min-w-0 mt-1 items-center gap-x-3 justify-between grow">
                  <h2 className="font-semibold truncate min-w-0">{ item?.firstName || '' } { item?.lastName || '' }</h2>
                  <div className={cn('flex items-center min-w-max text-sm font-medium p-1.5 rounded-md gap-x-1.5', { 'text-main bg-main/20': item.subscribed, 'text-secondary bg-secondary/20': !item.subscribed })}>
                    { !item.subscribed ? <>
                      <XCircleIcon className="w-5 h-5"/>
                      Not subscribed
                    </> : <>
                      <CheckBadgeIcon className="w-5 h-5"/>
                      Following
                    </> }
                  </div>
                </div>
              </div>
              <div className="flex">
                <Link to={`/app/users/${item._id}`} className="flex items-center min-w-max ml-auto p-1 text-main hover:text-main/70 transition gap-x-1">See profile <ArrowRightIcon className="w-4 h-4"/></Link>
              </div>
            </div>) }
          </> }
        </div>
      </div>
    </main>
  </>;
});

export default UsersLayout;
