import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { RootState } from '@/store/store';
import { MultisigTxStatus } from '@/types/enums';
import { MultisigAccount, Txn, Txns } from '@/types/multisig';
import {
  CLOSE_ICON_PATH,
  DELEGATE_TYPE_URL,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import { parseBalance, parseTokens } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import SignTxn from './SignTxn';
import BroadCastTxn from './BroadCastTxn';
import DialogViewRaw from './DialogViewRaw';

interface TransactionsListProps {
  chainID: string;
  isMember: boolean;
  txnsState: Txns;
  isHistory: boolean;
}

interface TransactionItemProps {
  isMember: boolean;
  txn: Txn;
  multisigAccount: MultisigAccount;
  membersCount: number;
  chainID: string;
  onViewMoreAction: (txn: Txn) => void;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
}

interface TransactionCardProps {
  isMember: boolean;
  txn: Txn;
  multisigAccount: MultisigAccount;
  membersCount: number;
  chainID: string;
  onViewMoreAction: (txn: Txn) => void;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
}

interface DialogViewTxnMessagesProps {
  open: boolean;
  isMember: boolean;
  txn: Txn;
  multisigAccount: MultisigAccount;
  membersCount: number;
  chainID: string;
  toggleMsgDialogOpen: () => void;
  onViewMoreAction: (txn: Txn) => void;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
}

const mapTxns = {
  '/cosmos.staking.v1beta1.MsgDelegate': 'Delegate',
  '/cosmos.bank.v1beta1.MsgSend': 'Send',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'ReDelegate',
  '/cosmos.staking.v1beta1.MsgUndelegate': 'UnDelegate',
  Msg: 'Tx Msg',
};

const emptyTxn = {
  id: NaN,
  multisig_address: '',
  fee: {
    amount: [
      {
        amount: '',
        denom: '',
      },
    ],
    gas: '',
    granter: '',
  },
  status: '',
  messages: [
    {
      typeUrl: '',
      value: {},
    },
  ],
  hash: '',
  err_msg: '',
  memo: '',
  signatures: [
    {
      signature: '',
      address: '',
    },
  ],
  last_updated: '',
  created_at: '',
};

const TransactionsList = ({
  chainID,
  isMember,
  txnsState,
  isHistory,
}: TransactionsListProps) => {
  const multisigAccount = useAppSelector(
    (state: RootState) => state.multisig.multisigAccount
  );
  const members = multisigAccount.pubkeys || [];
  const [msgDialogOpen, setMsgDialogOpen] = useState<boolean>(false);
  const [viewRawOpen, setViewRawDialogOpen] = useState<boolean>(false);

  const toggleMsgDialogOpen = () => {
    setMsgDialogOpen((prevState) => !prevState);
  };

  const toggleViewRawDialogOpen = () => {
    setViewRawDialogOpen((prevState) => !prevState);
  };

  const [selectedTxn, setSelectedTxn] = useState<Txn>(emptyTxn);

  const onViewMoreAction = (txn: Txn) => {
    setSelectedTxn(txn);
    setMsgDialogOpen(true);
  };

  const onViewRawAction = (txn: Txn) => {
    setSelectedTxn(txn);
    setViewRawDialogOpen(true);
  };

  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinMinimalDenom: minimalDenom,
    coinDecimals: decimals,
    coinDenom: displayDenom,
  };

  return (
    <div className="pb-6 space-y-6 text-[14px] flex flex-col justify-between">
      {txnsState.list.map((txn, index) => (
        <TransactionCard
          key={index}
          isMember={isMember}
          txn={txn}
          multisigAccount={multisigAccount}
          membersCount={members.length}
          chainID={chainID}
          isHistory={isHistory}
          onViewMoreAction={onViewMoreAction}
          currency={currency}
          onViewRawAction={onViewRawAction}
        />
      ))}
      <DialogViewTxnMessages
        open={msgDialogOpen}
        isMember={isMember}
        txn={selectedTxn}
        multisigAccount={multisigAccount}
        membersCount={members.length}
        chainID={chainID}
        isHistory={isHistory}
        toggleMsgDialogOpen={toggleMsgDialogOpen}
        onViewMoreAction={onViewMoreAction}
        currency={currency}
        onViewRawAction={onViewRawAction}
      />
      <DialogViewRaw
        open={viewRawOpen}
        onClose={toggleViewRawDialogOpen}
        txn={selectedTxn}
      />
    </div>
  );
};

export default TransactionsList;

const TransactionCard = ({
  isMember,
  txn,
  multisigAccount,
  membersCount,
  chainID,
  onViewMoreAction,
  isHistory,
  currency,
  onViewRawAction,
}: TransactionCardProps) => {
  const isReadyToBroadcast = () => {
    let signs = txn?.signatures || [];
    if (signs?.length >= multisigAccount?.account?.threshold) return true;
    else return false;
  };
  return (
    <div className="txn-card">
      <div className="flex-1 flex gap-1 items-center truncate">
        <div className="overflow-hidden text-ellipsis w-[250px]">
          {txn?.messages?.length === 0 ? (
            <div>-</div>
          ) : (
            <div>
              <RenderTxnMsg msg={txn?.messages[0]} currency={currency} />
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
        <div className="flex justify-between gap-4 items-center">
          {!isHistory ? (
            <>
              {isReadyToBroadcast() ? (
                txn?.status === 'DONE' || txn?.status === 'FAILED' ? (
                  txn?.status
                ) : (
                  <BroadCastTxn
                    txn={txn}
                    multisigAccount={multisigAccount}
                    chainID={chainID}
                  />
                )
              ) : (
                <SignTxn
                  address={multisigAccount.account.address}
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
                <span className="underline underline-offset-2 text-[#4AA29C]">
                  Transaction Successful
                </span>
              ) : (
                <span className="text-[#E57575] underline underline-offset-2">
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
            <div className="action-image justify-center flex">
              <Image
                src="/delete-icon.svg"
                width={14}
                height={14}
                alt="Delete-Icon"
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({
  isMember,
  txn,
  multisigAccount,
  membersCount,
  chainID,
  onViewMoreAction,
  isHistory,
  currency,
  onViewRawAction,
}: TransactionItemProps) => {
  const threshold = multisigAccount.account.threshold || 0;
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const { address: walletAddress } = getChainInfo(chainID);

  const isWalletSigned = () => {
    let signs = txn?.signatures || [];
    let existedAddress = signs.filter((k) => k.address === walletAddress);

    if (existedAddress && existedAddress?.length) return true;
    else return false;
  };

  const onShowError = () => {};

  const isReadyToBroadcast = () => {
    let signs = txn?.signatures || [];
    if (signs?.length >= multisigAccount?.account?.threshold) return true;
    else return false;
  };

  return (
    <div className="flex gap-6 justify-between items-center text-white">
      <div className="flex-1 flex gap-1 items-center truncate">
        <div className=" truncate flex flex-col gap-4">
          {txn?.messages.map((msg, index) => {
            return (
              <div key={index}>
                <div className="flex gap-2">
                  <div className="font-bold">{`#${index + 1}`}</div>
                  <RenderTxnMsg msg={msg} currency={currency} />
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
            <span className="underline underline-offset-2">Success</span>
          ) : (
            <span className="text-red-500 underline underline-offset-2">
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
              txn?.status === 'DONE' || txn?.status === 'FAILED' ? (
                txn?.status
              ) : (
                <BroadCastTxn
                  txn={txn}
                  multisigAccount={multisigAccount}
                  chainID={chainID}
                />
              )
            ) : (
              <SignTxn
                address={multisigAccount.account.address}
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
        <div className="action-image justify-center flex">
          <Image
            src="/delete-icon.svg"
            width={14}
            height={14}
            alt="Delete-Icon"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

const DialogViewTxnMessages = ({
  open,
  isMember,
  txn,
  multisigAccount,
  membersCount,
  chainID,
  toggleMsgDialogOpen,
  onViewMoreAction,
  isHistory,
  currency,
  onViewRawAction,
}: DialogViewTxnMessagesProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => toggleMsgDialogOpen()}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white px-10">
          <div className="py-6 flex justify-end">
            <div
              onClick={() => {
                toggleMsgDialogOpen();
              }}
            >
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mb-[72px] space-y-6">
            <div>
              <div className="flex justify-between gap-6">
                <div className="flex-1">Messages</div>
                <div className="w-[50px]">Signed</div>
                {isHistory ? <div className="w-[80px]">Status</div> : null}
                <div className={isHistory ? `w-[100px]` : `w-[180px]`}>
                  Actions
                </div>
              </div>
              <div className="divider"></div>
            </div>
            <TransactionItem
              isMember={isMember}
              txn={txn}
              multisigAccount={multisigAccount}
              membersCount={membersCount}
              chainID={chainID}
              isHistory={isHistory}
              onViewMoreAction={onViewMoreAction}
              currency={currency}
              onViewRawAction={onViewRawAction}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const RenderTxnMsg = ({
  msg,
  currency,
}: {
  msg: Msg;
  currency: Currency;
}) => {
  const displayDenom = (amountObj: Coin[] | Coin) => {
    if (Array.isArray(amountObj)) {
      return parseTokens(amountObj, currency.coinDenom, currency.coinDecimals);
    } else {
      return parseTokens(
        [amountObj],
        currency.coinDenom,
        currency.coinDecimals
      );
    }
  };
  return (
    <div>
      {msg ? (
        <div>
          {msg.typeUrl === SEND_TYPE_URL ? (
            <p>
              <span className="font-bold">{mapTxns[msg?.typeUrl]}</span> &nbsp;
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp;To&nbsp;{' '}
              <span> {shortenAddress(msg?.value?.toAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === DELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{mapTxns[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp; To &nbsp;
              <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === UNDELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{mapTxns[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp; From &nbsp;
              <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === REDELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{mapTxns[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp;
              <br />
              From &nbsp;
              <span>{shortenAddress(msg?.value?.validatorSrcAddress, 20)}</span>
              &nbsp; To &nbsp;
              <span>{shortenAddress(msg?.value?.validatorDstAddress, 20)}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
