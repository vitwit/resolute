'use client';

import React from 'react';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import './../settings.css';
import SettingsLayout from '../SettingsLayout';
import CustomNetworkCard from '../components/CustomNetworkCard';
import AddressBook from '../components/AddressBook';
import { setAddNetworkDialogOpen } from '@/store/features/common/commonSlice';

const Page = () => {
  const dispatch = useAppDispatch();

  const addNetwork = () => {
    dispatch(setAddNetworkDialogOpen(true));
  };

  return (
    <SettingsLayout
      action={addNetwork}
      actionName="Add Network"
      tabName="general"
    >
      <div>
        <CustomNetworkCard />
        <AddressBook />
      </div>
    </SettingsLayout>
  );
};

export default Page;
