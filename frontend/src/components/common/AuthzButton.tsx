import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useState } from 'react';
import Image from 'next/image';
import { TOGGLE_OFF, TOGGLE_ON } from '@/constants/image-names';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import DialogAuthzGrants from './DialogAuthzGrants';

const AuthzButton = () => {
  const isAuthzEnabled = useAppSelector(
    (state) => state.authz.authzModeEnabled
  );

  const { disableAuthzMode } = useAuthzGrants();

  const [grantsDialogOpen, setGrantsDialogOpen] = useState(false);
  const toggleDialogOpen = () => {
    setGrantsDialogOpen((prev) => !prev);
  };
  return (
    <>
      <button
        onClick={() => {
          if (!isAuthzEnabled) {
            setGrantsDialogOpen(true);
          } else {
            disableAuthzMode();
          }
        }}
      >
        {isAuthzEnabled ? (
          <Image src={TOGGLE_ON} width={20} height={14} alt="authz-on" />
        ) : (
          <Image src={TOGGLE_OFF} width={20} height={14} alt="authz-off" />
        )}
      </button>
      {grantsDialogOpen && (
        <DialogAuthzGrants open={grantsDialogOpen} onClose={toggleDialogOpen} />
      )}
    </>
  );
};

export default AuthzButton;
