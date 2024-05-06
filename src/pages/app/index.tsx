// outsource dependencies
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckIcon, LockClosedIcon, LockOpenIcon, UsersIcon } from '@heroicons/react/24/solid';
import { BriefcaseIcon, CursorArrowRaysIcon, EyeIcon, MapPinIcon, PencilSquareIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

// local dependencies
import Users from './users/index.tsx';
import config from '@/constants/config.ts';
import Navbar from '@/components/navbar.tsx';
import UsersView from './users/view/index.tsx';
import { useSelf } from '@/pages/controller.ts';
import { Post, useController } from './controller.ts';
import { PageLoader } from '@/components/page-loader.tsx';

// assets
import userImage from '@/assets/user.png';
import defImage from '@/assets/def-image.svg';

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
  const [
    { initialized, forSubscribers, postContent, disabled, postsList, postImage },
    { initialize, clear, update, post }
  ] = useController();

  const handleChange = useCallback((event:ChangeEvent<HTMLInputElement>) => update({ postContent: event.target.value }), [update]);

  const banner = useMemo(() => !postImage ? null : URL.createObjectURL(postImage), [postImage]);

  useEffect(() => {
    initialize(); return clear;
  }, [clear, initialize]);

  const onDrop = useCallback(async (accepted:Array<File>, rejected:Array<FileRejection>) => {
    if (!rejected?.length) {
      update({ postImage: accepted[0] });
    } else {
      const getErrorMessage = (rejected: Array<FileRejection>) => {
        return rejected.map(({ file, errors }) => {
          switch (errors[0].code) {
            case 'file-invalid-type':
              return `File has type ${file.type} which is not supported"`;
            case 'file-too-large':
              return 'File is too large';
            default:
              return errors[0].message;
          }
        }).join(', ');
      };
      toast.error(getErrorMessage(rejected));
    }
  }, [update]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 15,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    validator: file => {
      const condition = /(\.jpg|\.jpeg|\.png)$/i;
      if (!condition.test(file.name)) { return { message: 'ERROR', code: 'file-invalid-type', }; }
      return null;
    }
  });

  if (!initialized) { return <PageLoader/>; }

  return <main className="w-full min-h-screen bg-gray-100">
    <div className="container mx-auto flex w-full min-h-screen flex-col pt-[80px] bg-gray-100">
      <div className="pt-6 grid grid-cols-12 gap-x-6">
        <div className="col-span-3">
          <div className="p-4 bg-white rounded-lg shadow sticky top-[104px]">
            <div className="flex gap-x-2 items-start mb-3">
              <img src={!self?.picturePath ? userImage : `${config('API_URL', '')}/${self.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
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


        </div>
        <div className="col-span-6">
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <div className="flex gap-x-4 items-center">
              <img src={!self?.picturePath ? userImage : `${config('API_URL', '')}/${self.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
              <input type="text" disabled={disabled} onChange={handleChange} value={postContent} placeholder="What's on your mind?" className="rounded-full w-full py-3 px-5 border border-gray-200 outline-0 hover:border-gray-400 transition disabled:pointer-events-none disabled:opacity-60 focus:ring-blue-300 focus:ring"/>
            </div>
            { !postImage ? null : <div className="pt-4">
              <div className="flex">
                <div className="relative">
                  <img src={banner || defImage} alt="post image" width="60" height="90" className="w-16 h-24 object-cover rounded border border-gray-300"/>
                  <button type="button" className="absolute top-0 right-0 mt-1 mr-1 bg-white transition hover:bg-white/80 p-0.5 rounded-full" onClick={() => update({ postImage: null })}><XMarkIcon className="w-4 h-4"/></button>
                </div>
              </div>
            </div> }
            <hr className="my-3"/>
            <div className="flex gap-x-2 justify-between items-center">
              <div className="flex gap-x-5 items-center">
                <div className="flex gap-x-2">
                  <input name="forSubscribers" id="forSubscribers" type="checkbox" checked={forSubscribers} onChange={() => update({ forSubscribers: !forSubscribers })} className="cursor-pointer"/>
                  <label htmlFor="forSubscribers" className="text-sm font-medium cursor-pointer">For subscribers only</label>
                </div>
                <>
                  <button type="button" disabled={disabled} className="flex gap-x-1 items-center px-2 py-1 rounded transition hover:bg-gray-50 active:bg-gray-200" {...getRootProps()}><PhotoIcon className="w-5 h-5"/>Image</button>
                  <input name="postImage" id="post-image" {...getInputProps()} />
                </>
              </div>
              <button type="button" className="btn-primary" disabled={!postContent} onClick={() => post()}>Post</button>
            </div>
          </div>

          { !postsList.length ? null : postsList.map(item => <PostItem key={item._id} data={item}/>) }
        </div>

        <div className="col-span-3">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex gap-x-3 items-center mb-4">
              <h3 className="text-lg font-medium">Your subscriptions</h3>
              <Link to="/app/users" className="btn-primary !p-1 ml-auto"><UsersIcon className="w-5 h-5"/></Link>
            </div>
            { !self?.subscriptions?.length ? <p>you don&apos;t have one yet</p> : (self?.subscriptions || []).map(item => <Link to={`/app/users/${item._id}`} key={item._id} className="flex gap-x-2 items-start mb-3 p-2 border border-gray-200 rounded-md shadow transition hover:shadow-md">
              <img src={!item?.picturePath ? userImage : `${config('API_URL', '')}/${item.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
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

type PostItemProps = { data: Post }

const PostItem = memo(({ data }:PostItemProps) => {
  const self = useSelf();
  const [value, setValue] = useState<null | string>(null);
  const [{ disabled }, { updatePost, deletePost }] = useController();

  const handleUpdate = useCallback(() => {
    updatePost({ _id: data._id, content: value || data.content, forSubscribers: data.forSubscribers, });
    setValue(null);
  }, [data._id, data.content, data.forSubscribers, updatePost, value]);
  const handleChangeVisibility = () => updatePost({ _id: data._id, content: data.content, forSubscribers: !data.forSubscribers, });

  const handleChange = useCallback(({ target }:ChangeEvent<HTMLInputElement>) => setValue(target.value), []);

  const isEditMode = value !== null;

  return <div className="p-4 bg-white rounded-lg shadow mb-4">
    <div className="flex gap-x-2 items-start mb-3">
      <img src={!self?.picturePath ? userImage : `${config('API_URL', '')}/${self.picturePath}`} alt="user avatar" width="48" height="48" className="w-12 h-12 rounded-full object-cover"/>
      <div className="flex min-w-0 mt-1 items-center gap-x-2 grow">
        <p className="font-medium truncate min-w-0 text-sm">{ self?.firstName || '' } { self?.lastName || '' }</p>
        <button type="button" onClick={handleChangeVisibility} disabled={disabled} className="flex gap-x-1 text-main ml-auto p-0.5 hover:bg-blue-50 active:bg-blue-100 transition text-xs rounded disabled:opacity-60 disabled:pointer-events-none">
          { !data.forSubscribers ? <><LockOpenIcon className="w-4 h-4 "/> For everyone</> : <><LockClosedIcon className="w-4 h-4"/> For subscribers</> }
        </button>
        <button type="button" disabled={disabled} onClick={() => setValue(data.content)} className="btn-primary !p-1 disabled:opacity-60 disabled:pointer-events-none"><PencilSquareIcon className="w-4 h-4"/></button>
        <button type="button" disabled={disabled} onClick={() => deletePost({ _id: data._id })} className="btn-secondary !p-1 disabled:opacity-60 disabled:pointer-events-none"><TrashIcon className="w-4 h-4"/></button>
      </div>
    </div>
    { !isEditMode
      ? <p className="mb-3" >{ data.content }</p>
      : <input type="text" onChange={handleChange} value={value || ''} autoFocus className="w-full focus:outline-0 focus:ring-blue-300 focus:ring-1 transition border border-blue-400 rounded p-1" /> }
    { !isEditMode ? null : <div className="my-1 flex gap-x-1">
      <button type="button" disabled={disabled} onClick={() => setValue(null)} className="ml-auto p-0.5 border rounded transition border-red-600 hover:bg-red-200 active:bg-red-300"><XMarkIcon className="w-4 h-4 text-red-600 text-opacity-80"/></button>
      <button type="button" disabled={disabled} onClick={handleUpdate} className="p-0.5 border rounded transition border-blue-600 hover:bg-blue-200 active:bg-blue-300"><CheckIcon className="w-4 h-4 text-blue-600 text-opacity-80"/></button>
    </div> }
    { !data.picturePath ? null : <div>
      <img src={`${config('API_URL', '')}/${data.picturePath}`} alt="post image" width="300" height="400" className="rounded max-h-[400px] max-w-[300px]"/>
    </div> }
    <p className="text-xs text-gray-500 text-end">{ format(new Date(data.createdAt), 'MM.dd.yyyy HH:mm') }</p>
  </div>;
});
