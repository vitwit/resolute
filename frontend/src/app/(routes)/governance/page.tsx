'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import GovDashboard from './gov-dashboard/GovDashboard';
import './style.css';

const Page = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  return <GovDashboard chainIDs={chainIDs} />;
};

export default Page;
