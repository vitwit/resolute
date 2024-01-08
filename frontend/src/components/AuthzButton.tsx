import React from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { Tooltip } from '@mui/material';

const AuthzButton = () => {
  const isAuthzEnabled = useAppSelector(
    (state) => state.authz.authzModeEnabled
  );
  const grantsToMeLoading = useAppSelector(
    (state) => state.authz.getGrantsToMeLoading > 0
  );
  
  return (
    <div className="flex gap-2">
      <Image src="/authz-icon-2.svg" width={32} height={32} alt="authz" />
      <div className="p-2 flex items-center gap-2 authz-button-background">
        <div className="text-white text-center text-sm not-italic font-normal leading-[normal]">
          Authz Mode
        </div>
        {isAuthzEnabled ? (
          <Tooltip
            title={grantsToMeLoading ? 'fetching authz permissions...' : ''}
          >
            <Image
              src="/authz-button-disabled.svg"
              width={32}
              height={32}
              alt="authz"
            />
          </Tooltip>
        ) : (
          <Image
            src="/authz-button-enabled.svg"
            width={32}
            height={32}
            alt="authz"
          />
        )}
      </div>
    </div>
  );
};

export default AuthzButton;
