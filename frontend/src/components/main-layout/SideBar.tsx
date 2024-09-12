'use client';

import React from 'react';
import ExitSession from './ExitSession';
import SideMenu from './SideMenu';
import SelectNetwork from './SelectNetwork';
import ConnectWallet from './ConnectWallet';
import DialogSelectNetwork from '../select-network/DialogSelectNetwork';
import DialogAddNetwork from '../select-network/DialogAddNetwork';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetShowAuthzAlert from '@/custom-hooks/useGetShowAuthzAlert';

const SideBar = () => {
  const addNetworkOpen = useAppSelector((state) => state.common.addNetworkOpen);
  const showAuthzAlert = useGetShowAuthzAlert();
  return (
    <section className={`sidebar ${showAuthzAlert ? "!h-[calc(100vh-114px)] top-[119px]":"!h-[calc(100vh-60px)] top-[65px]"}`}>
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
