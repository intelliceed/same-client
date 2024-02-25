// outsource dependencies
import { memo } from 'react';

// assets
import logo from '@/assets/logo.svg';

export const PageLoader = memo(() => <div className="min-h-screen w-full flex items-center justify-center p-10">
  <img src={logo} width="130" height="78" alt="entitys.io" className="animate-ping-slow"/>
</div>);
