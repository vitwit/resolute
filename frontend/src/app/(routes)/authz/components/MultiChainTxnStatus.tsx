import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { capitalizeFirstLetter, cleanURL } from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MultiChainTxnStatusProps {
  selectedMsgs: string[];
  chainsStatus: Record<string, ChainStatus>;
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
          const { chainLogo, chainName, explorerTxHashEndpoint } =
            getChainInfo(chainID);
          return (
            <div
              key={chainID}
              className="bg-[#FFFFFF0D] rounded-2xl w-full p-4 flex justify-between gap-6 items-center"
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
                <div className="flex flex-wrap gap-4">
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
              <div className="w-[25%] text-right">
                {chainsStatus?.[chainID]?.txStatus === 'pending' ? (
                  <div className="mr-2">
                    <span className="italic">Loading</span>
                    <span className="dots-flashing"></span>
                  </div>
                ) : (
                  <>
                    {chainsStatus?.[chainID]?.isTxSuccess ? (
                      <Link
                        href={`${cleanURL(
                          explorerTxHashEndpoint
                        )}/${chainsStatus?.[chainID]?.txHash}`}
                        className="underline underline-offset-2 text-[#4AA29C]"
                        target="_blank"
                      >
                        Transaction Successful
                      </Link>
                    ) : (
                      <Tooltip
                        title={
                          chainsStatus?.[chainID]?.error || 'Transaction Failed'
                        }
                        placement="top"
                      >
                        <span className="text-[#E57575] underline underline-offset-2 cursor-default">
                          {chainsStatus?.[chainID]?.error === 'Request rejected'
                            ? 'Wallet request rejected'
                            : 'Transaction Failed'}
                        </span>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiChainTxnStatus;
