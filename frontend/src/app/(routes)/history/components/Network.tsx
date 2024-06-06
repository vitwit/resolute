import React from 'react';
import Image from 'next/image';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

const Network = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="right-view-grid">
      <div className="flex space-x-2">
        <Image src="/network.svg" width={24} height={24} alt="Network-ICon" />
        <p className="text-b1 items-center flex">Network</p>
      </div>
      <div className="divider-line"></div>
      <div className="pl-2 pr-6 py-2.5 flex space-x-2">
        <p className="text-b1">cosmo827dhjf...jk8df838j0</p>

        <Image
          className="cursor-pointer"
          src="/copy.svg"
          height={24}
          width={24}
          alt="Copy"
          onClick={(e) => {
            copyToClipboard('cosmo827dhjf...jk8df838j0');
            dispatch(
              setError({
                type: 'success',
                message: 'Copied',
              })
            );
            e.stopPropagation();
          }}
        />
      </div>
      <div className="network-bg w-full justify-between">
        <p className="text-[12px]">cosmoshub-4</p>
        <p className="text-small-light">Network ID</p>
      </div>
    </div>
  );
};

export default Network;
