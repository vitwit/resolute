'use client';
import EmptyScreen from '@/components/common/EmptyScreen';
import PageHeader from '@/components/common/PageHeader';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import { COSMWASM_DESCRIPTION } from '@/utils/constants';
import React, { useEffect } from 'react';

const Cosmwasm = () => {
  const dispatch = useAppDispatch();

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };

  useEffect(() => {
    openChangeNetwork();
  }, []);

  return (
    <div className="py-10 h-full flex flex-col">
      <PageHeader title="Cosmwasm" description={COSMWASM_DESCRIPTION} />
      <div>
        <div className="flex-1 flex items-center justify-center mt-16">
          <EmptyScreen
            title="Please select a network"
            description="All networks page is not supported for cosmwasm, Please select a network."
            hasActionBtn={true}
            btnText={'Select Network'}
            btnOnClick={openChangeNetwork}
          />
        </div>
      </div>
    </div>
  );
};

export default Cosmwasm;
