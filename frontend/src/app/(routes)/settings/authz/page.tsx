'use client';

import React from 'react';
import '../settings.css';
import SettingsLayout from '../SettingsLayout';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import AuthzPage from './AuthzPage';

const Page = () => {
  const router = useRouter();

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const createNewAuthz = () => {
    router.push('/settings/authz/new-authz');
  };

  return (
    <SettingsLayout
      action={createNewAuthz}
      actionName="New Authz"
      tabName="authz"
    >
      <div>
        {chainIDs.length ? (
          <AuthzPage />
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
