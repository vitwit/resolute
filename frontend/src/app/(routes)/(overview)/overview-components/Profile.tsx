import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React from 'react';
import { Tooltip } from '@mui/material';
import { LOGOUT_ICON } from '@/utils/constants';
import { resetWallet } from '@/store/features/wallet/walletSlice';
import { logout } from '@/utils/localStorage';
import {
  resetError,
  resetTxAndHash,
} from '@/store/features/common/commonSlice';
import { resetState as bankReset } from '@/store/features/bank/bankSlice';
import { resetState as rewardsReset } from '@/store/features/distribution/distributionSlice';
import { resetCompleteState as stakingReset } from '@/store/features/staking/stakeSlice';
import { resetState as authzReset } from '@/store/features/authz/authzSlice';
import { resetState as feegrantReset } from '@/store/features/feegrant/feegrantSlice';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import useFeeGrants from '@/custom-hooks/useFeeGrants';

const Profile = () => {
  const profileName = useAppSelector((state) => state.wallet.name);
  const dispatch = useAppDispatch();
  const { disableAuthzMode } = useAuthzGrants();
  const { disableFeegrantMode } = useFeeGrants();

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center space-x-2 cursor-default">
        <Image
          className="rounded-full cursor-default"
          src="/profile.svg"
          width={36}
          height={36}
          alt="profile"
        ></Image>
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
            dispatch(bankReset());
            dispatch(rewardsReset());
            dispatch(stakingReset());
            dispatch(authzReset());
            dispatch(feegrantReset());
            disableAuthzMode();
            disableFeegrantMode();
            logout();
          }}
          className="cursor-pointer"
          src={LOGOUT_ICON}
          width={36}
          height={36}
          alt="Logout"
        />
      </Tooltip>
    </div>
  );
};

export default Profile;