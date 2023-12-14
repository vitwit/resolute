import { useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React from 'react';

const Profile = () => {
  const profileName = useAppSelector((state) => state.wallet.name);
  return (
    <div className="flex items-center space-x-2">
      <Image src="/profile.svg" width={36} height={36} alt="profile"></Image>
      <p className="text-white text-base not-italic font-normal max-w-[112px] leading-[normal truncate">
        {profileName}
      </p>
    </div>
  );
};

export default Profile;
