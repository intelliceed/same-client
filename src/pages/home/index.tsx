// outsource dependencies
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, PhotoIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// local dependencies
import Navbar from '@/components/navbar.tsx';
import { useSelf } from '@/pages/controller.ts';

const Home = memo(() => {
  const self = useSelf();

  return <>
    <Navbar/>
    <main className="bg-gray-100 min-h-screen flex flex-col pt-[80px]">
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Connect with the World</h2>
          <p className="text-lg text-gray-700 mb-8">Join SameFame and discover new friends, share your moments, and stay connected.</p>
          <Link to={!self ? '/auth/login' : '/app'} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold">Get Started</Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose SameFame?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 flex flex-col items-center">
              <div className=" mb-4 p-2 bg-blue-500 text-white rounded-full">
                <UserGroupIcon className="h-12 w-12"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Friends</h3>
              <p className="text-gray-700">Discover people with similar interests and make new connections.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className=" mb-4 p-2 bg-blue-500 text-white rounded-full">
                <PhotoIcon className="h-12 w-12"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Moments</h3>
              <p className="text-gray-700">Share your favorite moments with friends and family in an instant.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className=" mb-4 p-2 bg-blue-500 text-white rounded-full">
                <LinkIcon className="h-12 w-12"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-700">Stay connected with your friends and never miss any updates.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 SameFame. All rights reserved.</p>
        </div>
      </footer>
    </main>
  </>;
});

export default Home;
