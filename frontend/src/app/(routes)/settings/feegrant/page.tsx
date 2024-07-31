'use client';

import React from 'react';
import SettingsHeader from '../components/SettingsHeader';
import '../settings.css';

const page = () => {
  const createNewFeegrant = () => {};
  return (
    <div className="mt-10">
      <SettingsHeader
        action={createNewFeegrant}
        actionName="New Feegrant"
        tabName="feegrant"
      />
    </div>
  );
};

export default page;
