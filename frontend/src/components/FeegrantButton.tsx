import React, { useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { Tooltip } from '@mui/material';
import { isMetaMaskWallet } from '@/utils/localStorage';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import DialogFeegrants from './DialogFeegrants';

const FeegrantButton = () => {
  const isFeegrantEnabled = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );
  const grantsToMeLoading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading > 0
  );

  const { getInterChainGrants, disableFeegrantMode } = useFeeGrants();
  const grants = getInterChainGrants();

  const [grantsDialogOpen, setGrantsDialogOpen] = useState(false);
  const handleGransDialogClose = () => {
    setGrantsDialogOpen(false);
  };

  const isMetaMask = isMetaMaskWallet();

  return (
    <div className="flex gap-2 items-center">
      <DialogFeegrants
        open={grantsDialogOpen}
        onClose={handleGransDialogClose}
        grants={grants}
      />
      <Tooltip
        title={
          isMetaMask
            ? "MetaMask doesn't support Feegrant"
            : grantsToMeLoading
              ? 'fetching feegrant allowances...'
              : !grants.length
                ? 'No feegrant allowances'
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
            if (!isFeegrantEnabled) {
              if (!grantsToMeLoading && grants.length && !isMetaMask)
                setGrantsDialogOpen(true);
            } else {
              disableFeegrantMode();
            }
          }}
        >
          <div className="flex p-2 items-center gap-2 feegrant-button-background">
            <div className="text-white text-center text-sm not-italic font-normal leading-[normal]">
              Use Feegrant
            </div>
            {!isFeegrantEnabled ? (
              <Image
                src="/feegrant-button-disabled.svg"
                width={32}
                height={32}
                alt="feegrant"
              />
            ) : (
              <Image
                src="/feegrant-button-enabled.svg"
                width={32}
                height={32}
                alt="feegrant"
              />
            )}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default FeegrantButton;
