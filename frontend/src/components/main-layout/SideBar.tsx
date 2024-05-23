'use client';

import React from 'react';
import ExitSession from './ExitSession';
import SideMenu from './SideMenu';
import SelectNetwork from './SelectNetwork';

const SideBar = () => {
  return (
    <section className="sidebar">
      <SelectNetwork />
      <SideMenu />
      <ExitSession />
    </section>
  );
};

export default SideBar;
