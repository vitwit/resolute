import { useAppSelector } from '@/custom-hooks/StateHooks';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import React, { useState } from 'react';
import DialogFeegrants from './DialogFeegrants';
import Image from 'next/image';
import { TOGGLE_OFF, TOGGLE_ON } from '@/constants/image-names';

const FeegrantButton = () => {
  const isFeegrantEnabled = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );

  const { disableFeegrantMode } = useFeeGrants();

  const [grantsDialogOpen, setGrantsDialogOpen] = useState(false);
  const toggleDialogOpen = () => {
    setGrantsDialogOpen((prev) => !prev);
  };
  return (
    <>
      <button
        onClick={() => {
          if (!isFeegrantEnabled) {
            setGrantsDialogOpen(true);
          } else {
            disableFeegrantMode();
          }
        }}
      >
        {isFeegrantEnabled ? (
          <Image src={TOGGLE_ON} width={20} height={14} alt="feegrant" />
        ) : (
          <Image src={TOGGLE_OFF} width={20} height={14} alt="feegrant" />
        )}
      </button>
      {grantsDialogOpen && (
        <DialogFeegrants open={grantsDialogOpen} onClose={toggleDialogOpen} />
      )}
    </>
  );
};

export default FeegrantButton;
