'use client';

import React from 'react';
import './../settings.css';
import SettingsLayout from '../SettingsLayout';
import CustomNetworkCard from '../components/CustomNetworkCard';
import AddressBook from '../components/AddressBook';

const page = () => {
  const addNetwork = () => {};
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

export default page;
