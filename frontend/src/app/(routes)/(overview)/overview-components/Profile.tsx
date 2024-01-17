import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import { LOGOUT_ICON, SUPPORTED_WALLETS } from '@/utils/constants';
import {
  establishWalletConnection,
  resetWallet,
} from '@/store/features/wallet/walletSlice';
import { getLocalNetworks, getWalletName, logout } from '@/utils/localStorage';
import {
  resetError,
  resetTxAndHash,
} from '@/store/features/common/commonSlice';
<<<<<<< HEAD
=======
import { resetState as bankReset } from '@/store/features/bank/bankSlice';
import { resetState as rewardsReset } from '@/store/features/distribution/distributionSlice';
import { resetCompleteState as stakingReset } from '@/store/features/staking/stakeSlice';
import { resetState as authzReset } from '@/store/features/authz/authzSlice';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import WalletPopup from '@/components/WalletPopup';
import { networks } from '@/utils/chainsInfo';

>>>>>>> f78e2f6 (feat(wallet): add switch wallet functionality (#1114))
const Profile = () => {
  const profileName = useAppSelector((state) => state.wallet.name);
  const dispatch = useAppDispatch();

  const [connectWalletDialogOpen, setConnectWalletDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setConnectWalletDialogOpen(
      (connectWalletDialogOpen) => !connectWalletDialogOpen
    );
  };

  const selectWallet = (walletName: string) => {
    tryConnectWallet(walletName);
    handleClose();
  };

  const tryConnectWallet = (walletName: string) => {
    dispatch(
      establishWalletConnection({
        walletName,
        networks: [...networks, ...getLocalNetworks()],
      })
    );
  };

  const selectedWallet = getWalletName();
  const walletLogo = SUPPORTED_WALLETS.filter((wallet) => {
    return wallet.name.toLowerCase() === selectedWallet;
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center space-x-2 cursor-default">
        <Tooltip title="Switch Wallet" placement="bottom">
          <Image
            className="rounded-full cursor-pointer"
            src={walletLogo?.length ? walletLogo[0].logo : '/profile.svg'}
            width={36}
            height={36}
            alt="profile"
            onClick={() => setConnectWalletDialogOpen(true)}
          ></Image>
        </Tooltip>
        <Tooltip title={profileName} arrow placement="bottom">
          <p className="text-white text-base not-italic font-normal max-w-[112px] leading-[normal truncate">
            {profileName}
          </p>
        </Tooltip>
      </div>
      <Tooltip title="Logout">
        <Image
          onClick={() => {
            dispatch(resetWallet());
            dispatch(resetError());
            dispatch(resetTxAndHash());
            logout();
          }}
          className="cursor-pointer"
          src={LOGOUT_ICON}
          width={36}
          height={36}
          alt="Logout"
        />
      </Tooltip>
      <WalletPopup
        isOpen={connectWalletDialogOpen}
        onClose={handleClose}
        selectWallet={selectWallet}
        isSwitchWallet={true}
      />
    </div>
  );
};

export default Profile;
