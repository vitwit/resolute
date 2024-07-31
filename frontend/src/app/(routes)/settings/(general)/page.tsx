'use client';

import React from 'react';
import './../settings.css';
import SettingsLayout from '../SettingsLayout';

const page = () => {
  const addNetwork = () => {};
  return (
    <SettingsLayout
      action={addNetwork}
      actionName="Add Network"
      tabName="general"
    >
      <div>General Settings</div>
    </SettingsLayout>
  );
};

export default page;
