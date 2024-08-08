'use client';

import React from 'react';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import './../settings.css';
import SettingsLayout from '../SettingsLayout';
import { setAddNetworkDialogOpen } from '@/store/features/common/commonSlice';
import CustomNetworks from './components/CustomNetworks';

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
        <CustomNetworks />
        {/* TODO: Implement address book functionality and integrate at all address fields */}
        {/* TODO: Empty screen when no custom networks or no addresses */}
      </div>
    </SettingsLayout>
  );
};

export default Page;
