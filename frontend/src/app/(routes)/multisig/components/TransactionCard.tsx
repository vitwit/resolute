import Image from 'next/image';
import React from 'react';
import DeleteTxn from './DeleteTxn';
import Link from 'next/link';
import { cleanURL } from '@/utils/util';
import BroadCastTxn from './BroadCastTxn';
import SignTxn from './SignTxn';
import { Tooltip } from '@mui/material';
import TxnMsg from './msgs/TxnMsg';
import { Txn } from '@/types/multisig';

interface TransactionCardProps {
  isMember: boolean;
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  membersCount: number;
  chainID: string;
  onViewMoreAction: (txn: Txn) => void;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
  onViewError: (errMsg: string) => void;
  explorerTxHashEndpoint: string;
}

const TransactionCard: React.FC<TransactionCardProps> = (props) => {
  const {
    isMember,
    txn,
    multisigAddress,
    threshold,
    membersCount,
    chainID,
    onViewMoreAction,
    isHistory,
    currency,
    onViewRawAction,
    onViewError,
    explorerTxHashEndpoint,
  } = props;
  const isReadyToBroadcast = () => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };
  return (
    <div className="txn-card">
      <div className="flex justify-between">
        <div className="flex-1 flex gap-1 items-center truncate">
          <div className="overflow-hidden text-ellipsis w-[250px]">
            {txn?.messages?.length === 0 ? (
              <div>-</div>
            ) : (
              <div>
                <TxnMsg msg={txn?.messages[0]} currency={currency} />
              </div>
            )}
          </div>
          {txn?.messages.length ? (
            <Tooltip title="View More" placement="top">
              <Image
                src="/view-more-icon.svg"
                height={16}
                width={16}
                alt="View More"
                className="cursor-pointer"
                onClick={() => onViewMoreAction(txn)}
              />
            </Tooltip>
          ) : null}
        </div>
        <div>
          {' '}
          <span>
            {txn?.signatures?.length || 0}/{membersCount}
          </span>{' '}
          <span>Signed</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-4 items-center">
          {!isHistory ? (
            <>
              {isReadyToBroadcast() ? (
                <BroadCastTxn
                  txn={txn}
                  multisigAddress={multisigAddress}
                  pubKeys={txn.pubkeys || []}
                  threshold={threshold}
                  chainID={chainID}
                  isMember={true}
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
          ) : (
            <div className="cursor-pointer">
              {txn?.status === 'SUCCESS' ? (
                <Link
                  href={`${cleanURL(explorerTxHashEndpoint)}/${txn.hash}`}
                  className="underline underline-offset-2 text-[#4AA29C]"
                >
                  Transaction Successful
                </Link>
              ) : (
                <span
                  className="text-[#E57575] underline underline-offset-2"
                  onClick={() => onViewError(txn?.err_msg || '')}
                >
                  Transaction Failed
                </span>
              )}
            </div>
          )}
          <div className="flex gap-6">
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
            <DeleteTxn
              txId={txn.id}
              address={multisigAddress || ''}
              chainID={chainID}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
