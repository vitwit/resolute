'use client';

import React from 'react';
import '../settings.css';
import SettingsLayout from '../SettingsLayout';
import FeegrantFilters from '../components/FeegrantFilters';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const createNewFeegrant = () => {
    router.push('/settings/feegrant/new-feegrant');
  };

  return (
    <SettingsLayout
      action={createNewFeegrant}
      actionName="New Feegrant"
      tabName="feegrant"
    >
      <div>
        <FeegrantFilters />
      </div>
    </SettingsLayout>
  );
};

export default page;
