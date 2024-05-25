'use client';
import React from 'react';
import FixedLayout from './fixed-layout/FixedLayout';

const SideBar = ({ children }: { children: React.ReactNode }) => {
  return <FixedLayout>{children}</FixedLayout>;
};

export default SideBar;
