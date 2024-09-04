import React from 'react';
import Dashboard from './Dashboard';


const Home: React.FC = () => {
  const title = 'Dashboard';

  return (
    <div className="w-full relative">
      <Dashboard />
    </div>
  );
}

export default Home;