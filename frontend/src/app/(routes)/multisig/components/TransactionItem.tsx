import { MultisigAddressPubkey, Txn } from '@/types/multisig';
import React, { useEffect, useState } from 'react';
import TxnMsg from './msgs/TxnMsg';
import Link from 'next/link';
import { cleanURL, isMultisigMember } from '@/utils/util';
import BroadCastTxn from './BroadCastTxn';
import SignTxn from './SignTxn';
import Image from 'next/image';
import { Tooltip } from '@mui/material';
import DeleteTxn from './DeleteTxn';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

interface TransactionItemProps {
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  membersCount: number;
  chainID: string;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
  explorerTxHashEndpoint: string;
  onViewError: (errMsg: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = (props) => {
  const {
    txn,
    multisigAddress,
    pubKeys,
    threshold,
    membersCount,
    chainID,
    isHistory,
    currency,
    onViewRawAction,
    explorerTxHashEndpoint,
    onViewError,
  } = props;
  const isReadyToBroadcast = () => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  const [isMember, setIsMember] = useState<boolean>(false);
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);

  console.log(pubKeys)
  console.log(walletAddress)
  console.log(isMultisigMember(pubKeys, walletAddress))

  useEffect(() => {
    const result = isMultisigMember(pubKeys, walletAddress);
    setIsMember(result);
  }, [pubKeys]);

  return (
    <div className="flex gap-6 justify-between items-center text-white">
      <div className="flex-1 flex gap-1 items-center truncate">
        <div className=" truncate flex flex-col gap-4">
          {txn?.messages.map((msg, index) => {
            return (
              <div key={index}>
                <div className="flex gap-2">
                  <div className="font-bold">{`#${index + 1}`}</div>
                  <TxnMsg msg={msg} currency={currency} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-[50px] truncate">
        {txn?.signatures?.length || 0}/{membersCount}
      </div>
      {isHistory ? (
        <div className="w-[80px] cursor-pointer">
          {txn?.status === 'SUCCESS' ? (
            <Link
              href={`${cleanURL(explorerTxHashEndpoint)}/${txn.hash}`}
              className="underline underline-offset-2 text-[#4AA29C]"
              target="_blank"
            >
              Success
            </Link>
          ) : (
            <span
              className="text-[#E57575] underline underline-offset-2"
              onClick={() => onViewError(txn?.err_msg || '')}
            >
              Failed
            </span>
          )}
        </div>
      ) : null}
      <div
        className={
          isHistory
            ? `w-[100px] flex justify-between gap-4`
            : `w-[180px] flex justify-between gap-4`
        }
      >
        {!isHistory ? (
          <>
            {isReadyToBroadcast() ? (
              <BroadCastTxn
                txn={txn}
                multisigAddress={multisigAddress}
                pubKeys={pubKeys}
                threshold={threshold}
                isMember={isMember}
                chainID={chainID}
              />
            ) : (
              <SignTxn
                address={multisigAddress}
                isMember={isMember}
                unSignedTxn={txn}
                txId={txn?.id}
                chainID={chainID}
              />
            )}
          </>
        ) : null}
        <Tooltip title="View raw" placement="top">
          <div
            className="relative action-image justify-center flex"
            onClick={() => {
              if (txn) {
                onViewRawAction(txn);
              }
            }}
          >
            <Image
              src="/raw-icon.svg"
              height={14}
              width={14}
              alt="Raw-Icon"
              className="cursor-pointer"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[4px] font-medium">
              RAW
            </div>
          </div>
        </Tooltip>
        <DeleteTxn txId={txn.id} address={multisigAddress} chainID={chainID} isMember={isMember} />
      </div>
    </div>
  );
};

export default TransactionItem;
