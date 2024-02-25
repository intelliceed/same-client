// outsource dependencies
import { Cog6ToothIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';

export const Maintenance = () => <div className="min-h-screen flex flex-col items-center justify-center grow mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full">
  <div className="relative">
    <div className="flex h-36 w-full relative justify-center">
      <div className="">
        <Cog6ToothIcon className="w-20 h-20 animate-spin text-green-600"/>
      </div>
      <div className="-ml-6 ">
        <Cog6ToothIcon className="w-36 h-36 animate-spin text-indigo-600 rotate-180"/>
      </div>
      <div className="-ml-6">
        <Cog8ToothIcon className="w-32 h-32 animate-spin text-yellow-600"/>
      </div>
    </div>
    <h1 className="text-2xl font-bold text-center">Application is under maintenance</h1>
  </div>
</div>;
