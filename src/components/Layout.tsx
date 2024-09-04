import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Adjust the import based on your file structure

const Layout: React.FC = () => {
  return (
    <div className="flex w-screen max-w-screen h-screen">
      <div id="sidebar" className="max-w-72 w-72">
        <Sidebar />
      </div>
      <main className="ms-12 pe-12 pt-6 pb-10 px-4 sm:px-6 lg:px-6 flex justify-center items-start w-full">
        <div className="max-w-7xl w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
