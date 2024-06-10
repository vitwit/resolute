'use client';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import React from 'react';

const Multisig = () => {
  const dispatch = useAppDispatch();
  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };
  return (
    <div>
      <button className="primary-btn" onClick={openChangeNetwork}>
        Select Network
      </button>
    </div>
  );
};

export default Multisig;
