import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { capitalizeFirstLetter } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

interface MultiChainTxnStatusProps {
  selectedMsgs: string[];
  chainsStatus: Record<string, string>;
  selectedChains: string[];
}

const MultiChainTxnStatus = ({
  chainsStatus,
  selectedMsgs,
  selectedChains,
}: MultiChainTxnStatusProps) => {
  const { getChainInfo } = useGetChainInfo();

  return (
    <div>
      <div className="font-medium py-[6px] mb-4">Transactions Status</div>
      <div className="space-y-10">
        {selectedChains.map((chainID) => {
          const { chainLogo, chainName } = getChainInfo(chainID);
          return (
            <div
              key={chainID}
              className="bg-[#FFFFFF0D] rounded-2xl w-full p-4 flex justify-between items-center"
            >
              <div className="space-y-4 flex-1">
                <div className="flex gap-2 items-center">
                  <Image
                    className="rounded-full"
                    src={chainLogo}
                    width={32}
                    height={32}
                    alt=""
                  />
                  <div className="text-[14px] font-light">
                    {capitalizeFirstLetter(chainName)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  {selectedMsgs.map((msg) => (
                    <div
                      key={msg}
                      className="bg-[#FFFFFF1A] rounded-lg opacity-80 p-2"
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              <div>{chainsStatus?.[chainID]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiChainTxnStatus;
