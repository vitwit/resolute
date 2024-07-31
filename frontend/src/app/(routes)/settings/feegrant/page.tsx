'use client';

import React from 'react';
import '../settings.css';
import SettingsLayout from '../SettingsLayout';

const page = () => {
  const createNewFeegrant = () => {};
  return (
    <SettingsLayout
      action={createNewFeegrant}
      actionName="New Feegrant"
      tabName="feegrant"
    >
      <div>Feegrant</div>
    </SettingsLayout>
  );
};

export default page;
