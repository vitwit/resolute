'use client';
import React, { useEffect } from 'react';
import {
  getMultisigAccounts,
  verifyAccount,
} from '../../../store/features/multisig/multisigSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';

const Multisig = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(
        verifyAccount({
          chainID: 'cosmoshub-4',
          address: 'cosmos1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltglu9nrk',
        })
      );
    }, 1500);
  }, []);
  return <div></div>;
};

export default Multisig;
