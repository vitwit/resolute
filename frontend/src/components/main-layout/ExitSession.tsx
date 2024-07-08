import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  resetError,
  resetTxAndHash,
} from '@/store/features/common/commonSlice';
import { resetWallet } from '@/store/features/wallet/walletSlice';
import { resetState as bankReset } from '@/store/features/bank/bankSlice';
import { resetState as rewardsReset } from '@/store/features/distribution/distributionSlice';
import { resetCompleteState as stakingReset } from '@/store/features/staking/stakeSlice';
import { resetState as authzReset } from '@/store/features/authz/authzSlice';
import { resetState as feegrantReset } from '@/store/features/feegrant/feegrantSlice';
import Image from 'next/image';
import React, { useState } from 'react';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { logout } from '@/utils/localStorage';
import DialogConfirmExitSession from './DialogConfirmExitSession';

const ExitSession = () => {
  const dispatch = useAppDispatch();
  const { disableAuthzMode } = useAuthzGrants();
  const { disableFeegrantMode } = useFeeGrants();

  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const onExitSession = () => {
    setConfirmExitOpen(true);
  };

  const exitSession = () => {
    dispatch(resetWallet());
    dispatch(resetError());
    dispatch(resetTxAndHash());
    dispatch(bankReset());
    dispatch(rewardsReset());
    dispatch(stakingReset());
    dispatch(authzReset());
    dispatch(feegrantReset());
    disableAuthzMode();
    disableFeegrantMode();
    logout();
  };

  const onConfirmExitSession = () => {
    exitSession();
    setConfirmExitOpen(false);
  };

  return (
    <>
      {isWalletConnected ? (
        <div className="fixed-bottom w-full">
          <button
            onClick={() => onExitSession()}
            className="flex gap-2 !h-8 items-center pl-3 pr-6 w-full font-medium rounded-full hover:bg-[#FFFFFF0A]"
          >
            <Image
              src="/sidebar-menu-icons/logout-icon.svg"
              height={20}
              width={20}
              alt="Dashboard"
              className="opacity-60"
            />
            <div className=" text-[14px] leading-[19px]">Exit Session</div>
          </button>
        </div>
      ) : null}
      <DialogConfirmExitSession
        open={confirmExitOpen}
        onClose={() => setConfirmExitOpen(false)}
        onConfirm={onConfirmExitSession}
      />
    </>
  );
};

export default ExitSession;
