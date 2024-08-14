import Copy from '@/components/common/Copy';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  capitalizeFirstLetter,
  cleanURL,
  shortenAddress,
  shortenName,
} from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { REDIRECT_ICON } from '@/constants/image-names';
import SelectedChains from '../../../(general)/components/SelectedChains';

const DialogAuthzTxStatus = ({
  onClose,
  open,
  chainsStatus,
  selectedChains,
  selectedMsgs,
  granteeAddress,
}: {
  open: boolean;
  onClose: () => void;
  selectedMsgs: string[];
  chainsStatus: Record<string, ChainStatus>;
  selectedChains: string[];
  granteeAddress: string;
}) => {
  const { getChainInfo } = useGetChainInfo();
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);

  return (
    <CustomDialog title="New Authz" open={open} onClose={onClose}>
      <div className="w-[800px] space-y-4">
        <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
          <div className="text-[#FFFFFF80] font-light text-[14px] w-[124px]">
            Grantee Address
          </div>
          <div className="flex items-center gap-2">
            <div className="">{shortenAddress(granteeAddress, 20)}</div>
            <Copy content={granteeAddress} />
          </div>
        </div>
        <SelectedChains selectedChains={selectedChains} />
        <div className="space-y-10">
          {selectedChains.map((chain) => {
            const chainID = nameToChainIDs?.[chain.toLowerCase()] || '';
            const { chainLogo, chainName, explorerTxHashEndpoint } =
              getChainInfo(chainID);
            return (
              <div
                key={chainID}
                className="bg-[#FFFFFF05] rounded-2xl w-full p-6 flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex gap-2 items-center">
                      <Image
                        className="rounded-full"
                        src={chainLogo}
                        width={24}
                        height={24}
                        alt=""
                      />
                      <div className="text-[14px]">
                        {capitalizeFirstLetter(chainName)}
                      </div>
                    </div>

                    <div className="">
                      {chainsStatus?.[chainID]?.txStatus === 'pending' ? (
                        <div className="text-[#ffffff80] text-[14px] animate-pulse">
                          <span className="italic">Transaction Pending</span>
                          <span className="dots-flashing"></span>
                        </div>
                      ) : (
                        <>
                          {chainsStatus?.[chainID]?.isTxSuccess ? (
                            <div className="flex items-end gap-2">
                              <div className="flex items-end gap-1 text-[14px]">
                                <div>
                                  {shortenName(
                                    chainsStatus?.[chainID]?.txHash,
                                    18
                                  )}
                                </div>
                                <Copy
                                  content={chainsStatus?.[chainID]?.txHash}
                                />
                              </div>
                              <Link
                                href={`${cleanURL(
                                  explorerTxHashEndpoint
                                )}/${chainsStatus?.[chainID]?.txHash}`}
                                className="underline underline-offset-2 text-[#2BA472] text-[14px] flex items-end gap-1"
                                target="_blank"
                              >
                                <div>Transaction Successful</div>
                                <Image
                                  src={REDIRECT_ICON}
                                  width={18}
                                  height={18}
                                  alt=""
                                />
                              </Link>
                            </div>
                          ) : (
                            <Tooltip
                              title={
                                chainsStatus?.[chainID]?.error ||
                                'Transaction Failed'
                              }
                              placement="top"
                            >
                              <span className="text-[#D92101] underline underline-offset-2 cursor-default">
                                {chainsStatus?.[chainID]?.error ===
                                'Request rejected'
                                  ? 'Wallet request rejected'
                                  : 'Transaction Failed'}
                              </span>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="divider-line"></div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {selectedMsgs.map((msg) => (
                    <div
                      key={msg}
                      className="bg-[#FFFFFF0F] text-[14px] rounded-lg opacity-80 py-2 px-4"
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogAuthzTxStatus;
