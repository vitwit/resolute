import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React from 'react';
import { Tooltip } from '@mui/material';
import { LOGOUT_ICON } from '@/utils/constants';
import { resetWallet } from '@/store/features/wallet/walletSlice';
import { logout } from '@/utils/localStorage';
const Profile = () => {
  const profileName = useAppSelector((state) => state.wallet.name);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-1">
      <Tooltip title={profileName} arrow placement="bottom">
        <div className="flex items-center space-x-2 cursor-default">
          <Image
            src="/profile.svg"
            width={36}
            height={36}
            alt="profile"
          ></Image>
          <p className="text-white text-base not-italic font-normal max-w-[112px] leading-[normal truncate">
            {profileName}
          </p>
        </div>
      </Tooltip>
      <Tooltip title="Logout">
        <Image
          onClick={() => {
            dispatch(resetWallet());
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
