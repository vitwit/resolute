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
import React from 'react';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { logout } from '@/utils/localStorage';

const ExitSession = () => {
  const dispatch = useAppDispatch();
  const { disableAuthzMode } = useAuthzGrants();
  const { disableFeegrantMode } = useFeeGrants();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const onExitSession = () => {
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
  return (
    <>
      {isWalletConnected ? (
        <div className="fixed-bottom w-full">
          <button
            onClick={() => onExitSession()}
            className="flex gap-2 h-10 items-center pl-3 pr-6 w-full font-medium rounded-full hover:bg-[#FFFFFF0A]"
          >
            <Image
              src="/sidebar-menu-icons/logout-icon.svg"
              height={20}
              width={20}
              alt="Dashboard"
            />
            <div className="text-white text-[16px] leading-[19px]">
              Exit Session
            </div>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ExitSession;
