'use client';

import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import '@/app/fixed-layout.css';

const FixedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />
      <main className="flex flex-1 bg-[#020002] w-full justify-center">
        <div className="w-full max-w-[1512px] flex">
          <Sidebar />
          <section className="main-section px-10">{children}</section>
        </div>
      </main>
    </div>
  );
};

export default FixedLayout;
