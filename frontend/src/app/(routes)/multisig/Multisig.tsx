'use client';
import TopNav from '@/components/TopNav';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import Image from 'next/image';
import React from 'react';

const Multisig = () => {
  const dispatch = useAppDispatch();
  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };
  const message =
    'All Networks page is not supported for Multisig, Please select a network.';
  return (
    <div>
      <button className="primary-btn" onClick={openChangeNetwork}>
        Select Network
      </button>
    </div>
  );
};

export default Multisig;
