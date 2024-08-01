'use client';

import React from 'react';
import '../settings.css';
import SettingsLayout from '../SettingsLayout';
import FeegrantFilters from '../components/FeegrantFilters';

const page = () => {
  const createNewFeegrant = () => {};
 
  return (
    <SettingsLayout
      action={createNewFeegrant}
      actionName="New Feegrant"
      tabName="feegrant"
    >
      <div>
        <FeegrantFilters
          // handleFiltersChange={handleFiltersChange}
          // filter={filter}
        />
      </div>
    </SettingsLayout>
  );
};

export default page;
