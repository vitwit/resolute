'use client';

import React from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import '@/app/fixed-layout.css';
import useShortCuts from '@/custom-hooks/useShortCuts';

const FixedLayout = ({ children }: { children: React.ReactNode }) => {
  // Open select network dialog on '/' key press
  useShortCuts();

  return (
    <div className="fixed-layout">
      <TopBar />
      <main className="main">
        <div className="main-container">
          <SideBar />
          <section className="dynamic-section">{children}</section>
        </div>
      </main>
    </div>
  );
};

export default FixedLayout;
