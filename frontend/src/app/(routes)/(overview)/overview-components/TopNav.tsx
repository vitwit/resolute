import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { resetWallet } from '@/store/features/wallet/walletSlice';
import { logout } from '@/utils/localStorage';
import Image from 'next/image';
import React from 'react';

const TopNav = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between w-full items-center">
      <h2 className="text-white text-xl font-medium">Overview</h2>
      <div className="flex gap-10">
        <Image src="/history-icon.svg" height={40} width={40} alt="History" />
        <Image
          className="cursor-pointer"
          onClick={() => {
            dispatch(resetWallet());
            logout();
          }}
          src="/logout-icon.svg"
          height={40}
          width={40}
          alt="Logout"
        />
      </div>
    </div>
  );
};

export default TopNav;
