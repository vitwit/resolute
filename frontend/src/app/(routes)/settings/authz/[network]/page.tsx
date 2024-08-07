'use client';

import React from 'react';
import '../../settings.css';
import SettingsLayout from '../../SettingsLayout';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import AuthzPage from '../AuthzPage';

const Page = () => {
  const params = useParams();
  const paramChains = params.network;
  const chainNames =
    typeof paramChains === 'string' ? [paramChains.toLowerCase()] : paramChains;
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainIDs: string[] = [];
  Object.keys(nameToChainIDs).forEach((chain) => {
    chainNames.forEach((paramChain) => {
      if (chain === paramChain.toLowerCase())
        chainIDs.push(nameToChainIDs[chain]);
    });
  });

  const router = useRouter();
  const createNewAuthz = () => {
    router.push('/settings/authz/new-authz');
  };

  return (
    <SettingsLayout
      action={createNewAuthz}
      actionName="New Authz"
      tabName="authz"
    >
      {chainIDs.length ? (
        <AuthzPage />
      ) : (
        <div className="w-full h-full text-white flex justify-center items-center">
          - Chain Not found -
        </div>
      )}
    </SettingsLayout>
  );
};

export default Page;
