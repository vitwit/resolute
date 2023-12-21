import { useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React from 'react';
import { Tooltip } from '@mui/material';
const Profile = () => {
  const profileName = useAppSelector((state) => state.wallet.name);
  return (
    <Tooltip title={profileName} arrow placement='bottom'>
    <div className="flex items-center space-x-2 cursor-default">
      <Image src="/profile.svg" width={36} height={36} alt="profile"></Image>
      <p className="text-white text-base not-italic font-normal max-w-[112px] leading-[normal truncate">
        {profileName}
      </p>
    </div>
    </Tooltip>
  );
};

export default Profile;
