'use client';

import React from 'react';
import SettingsHeader from '../components/SettingsHeader';
import './../settings.css';

const page = () => {
  const addNetwork = () => {};
  return (
    <div className="mt-10">
      <SettingsHeader
        action={addNetwork}
        actionName="Add Network"
        tabName="general"
      />
    </div>
  );
};

export default page;
