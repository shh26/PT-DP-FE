import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  DocumentIcon,ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon, current: false },
  { name: 'New Opportunity', to: '/opportunity/create', icon: PlusCircleIcon, current: false },
  { name: 'Projects', to: '/projects', icon: FolderIcon, current: false },
  { name: 'Pipeline', to: '/pipeline', icon: DocumentIcon, current: false },
  { name: 'User Management', to: '/users', icon: UsersIcon, current: false },
  { name: 'Change Team', to: '/landing', icon: ArrowsRightLeftIcon, current: false },
];

const logo = [
  { alt: 'Atlas Copco', src: 'https://vtpsbtorage.blob.core.windows.net/vtps-sim/Logotype%20for%20teal%20BG_RGB.png?sp=r&st=2024-05-15T13:20:27Z&se=2026-05-15T21:20:27Z&spr=https&sv=2022-11-02&sr=b&sig=%2B63YfKvJIIsXNb4KBn0SNWaZ3PVebCZQG8bfKOPiInI%3D' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [showContent, setShowContent] = useState(true);
  const { setIsAuthenticated,user } = useAuth();
  
console.log(user?.role,'???????user nav')
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setShowContent(false);
    }
  }, [location.pathname, currentPath]);

  useEffect(() => {
    if (!showContent) {
      setTimeout(() => {
        setCurrentPath(location.pathname);
        setShowContent(true);
      }, 300);
    }
  }, [showContent, location.pathname]);

  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: item.to === currentPath,
  }));
  
  const handleLogout = ()=>{

    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)

    navigate('/login');
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-ac-teal px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img className="h-8 w-auto" src={logo[0].src} alt={logo[0].alt} />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">

                          {updatedNavigation.map((item) => {
                           
  if (item?.name === 'User Management' && user?.role !== 'superadmin') {
    return null;
  }

  return (
    <li key={item.name}>
      <Link
        to={item.to}
        className={classNames(
          item.current
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        {item.name}
      </Link>
    </li>
  );
})}

                          </ul>
                        </li>
                        <li className="mt-auto">
                          <button
                            onClick={handleLogout}
                            className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-ac-teal px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img className="h-16 w-auto" src={logo[0].src} alt={logo[0].alt} />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                  {updatedNavigation.map((item) => {
                           
                           if (item?.name === 'User Management' && user?.role !== 'superadmin') {
                             return null;
                           }
                         
                           return (
                             <li key={item.name}>
                               <Link
                                 to={item.to}
                                 className={classNames(
                                   item.current
                                     ? 'bg-gray-800 text-white'
                                     : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                   'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                 )}
                                 onClick={() => setSidebarOpen(false)}
                               >
                                 <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                 {item.name}
                               </Link>
                             </li>
                           );
                         })}
                  </ul>
                </li>
                <li className="mt-auto">
                  <button
                    onClick={handleLogout}
                    className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-ac-teal px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
        </div>
      </div>
    </>
  );
}