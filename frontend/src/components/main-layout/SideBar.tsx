'use client';

import React from 'react';
import ExitSession from './ExitSession';
import SideMenu from './SideMenu';
import SelectNetwork from './SelectNetwork';
import ConnectWallet from './ConnectWallet';
import DialogSelectNetwork from '../select-network/DialogSelectNetwork';
import DialogAddNetwork from '../select-network/DialogAddNetwork';
import { useAppSelector } from '@/custom-hooks/StateHooks';

const SideBar = () => {
  const addNetworkOpen = useAppSelector((state) => state.common.addNetworkOpen);
  return (
    <section className="sidebar">
      <SelectNetwork />
      <SideMenu />
      <ExitSession />
      <ConnectWallet />
      <DialogSelectNetwork />
      {addNetworkOpen ? <DialogAddNetwork /> : null}
    </section>
  );
};

export default SideBar;
