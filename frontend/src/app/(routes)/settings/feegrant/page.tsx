'use client';

import React from 'react';
import '../settings.css';
import SettingsLayout from '../SettingsLayout';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantPage from './FeegrantPage';

const Page = () => {
  const router = useRouter();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

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
        {chainIDs.length ? (
          <FeegrantPage chainIDs={chainIDs} />
        ) : (
          <div className="w-full h-full text-white flex justify-center items-center">
            - Chain Not found -
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default Page;
