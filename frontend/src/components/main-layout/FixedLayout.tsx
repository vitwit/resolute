'use client';

import React from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import '@/app/fixed-layout.css';

const FixedLayout = ({ children }: { children: React.ReactNode }) => {
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
