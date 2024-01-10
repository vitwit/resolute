import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { Tooltip } from '@mui/material';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import DialogAuthzGrants from './DialogAuthzGrants';

const AuthzButton = () => {
  const isAuthzEnabled = useAppSelector(
    (state) => state.authz.authzModeEnabled
  );
  const grantsToMeLoading = useAppSelector(
    (state) => state.authz.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants, disableAuthzMode } = useAuthzGrants();
  const grants = getInterChainGrants();

  const [grantsDialogOpen, setGrantsDialogOpen] = useState(false);
  const handleGransDialogClose = () => {
    setGrantsDialogOpen(false);
  };

  return (
    <div className="flex gap-2 items-center">
      <DialogAuthzGrants
        open={grantsDialogOpen}
        onClose={handleGransDialogClose}
        grants={grants}
      />
      {/* <Image src="/authz-icon-2.svg" width={32} height={32} alt="authz" /> */}
      <Tooltip
        title={
          grantsToMeLoading
            ? 'fetching authz permissions...'
            : !grants.length
              ? 'No authz permissions'
              : ''
        }
      >
        <div
          className={
            grantsToMeLoading || !grants.length
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          }
          onClick={() => {
            if (!isAuthzEnabled) {
              if (!grantsToMeLoading && grants.length)
                setGrantsDialogOpen(true);
            } else {
              disableAuthzMode();
            }
          }}
        >
          <div className="flex p-2 items-center gap-2 authz-button-background">
            <div className="text-white text-center text-sm not-italic font-normal leading-[normal]">
              Authz Mode
            </div>
            {!isAuthzEnabled ? (
              <Image
                src="/authz-button-disabled.svg"
                width={32}
                height={32}
                alt="authz"
              />
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
      </Tooltip>
    </div>
  );
};

export default AuthzButton;
