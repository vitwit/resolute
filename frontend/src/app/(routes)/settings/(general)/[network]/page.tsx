'use client';

import React from 'react';
import SettingsHeader from '../../components/SettingsHeader';
import '../../settings.css';

const page = () => {
  const addNetwork = () => {};
  return (
    <div className="mt-10">
      <SettingsHeader
        action={addNetwork}
        actionName="Add Network"
        tabName="general"
      />
      <div>Please select all networks to view access general settings</div>
    </div>
  );
};

export default page;
