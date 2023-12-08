'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Transfers from './components/Transfers';
import './transfers.css';

const Page = () => {
  const nameToChainsIDs = useAppSelector(
    (state) => state.wallet.nameToChainIDs
  );
  const chainNames = Object.keys(nameToChainsIDs);
  return <Transfers chainNames={chainNames} />;
};

export default Page;
