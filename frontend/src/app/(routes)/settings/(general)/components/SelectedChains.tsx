import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React from 'react';

const SelectedChains = ({ selectedChains }: { selectedChains: string[] }) => {
  const { getChainInfo } = useGetChainInfo();
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  return (
    <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
      <div className="text-[#FFFFFF80] font-light text-[14px] w-[124px]">
        Networks Selected
      </div>
      <div className="flex gap-6 items-center flex-wrap">
        {selectedChains.map((chainName) => {
          const chainID = nameToChainIDs?.[chainName.toLowerCase()];
          const { chainLogo } = getChainInfo(chainID);
          return <NetworkLogo key={chainName} logo={chainLogo} />;
        })}
      </div>
    </div>
  );
};

export default SelectedChains;

const NetworkLogo = ({ logo }: { logo: string }) => {
  return (
    <Image className="rounded-full" src={logo} width={24} height={24} alt="" />
  );
};
