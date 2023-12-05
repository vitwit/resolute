import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { RootState } from '@/store/store';
import { MultisigTxStatus } from '@/types/enums';
import { MultisigAccount, Txn, Txns } from '@/types/multisig';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { parseTokens } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import {
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

interface TransactionsListProps {
  chainID: string;
  isMember: boolean;
  txnsState: Txns;
  isHistory: boolean;
}

interface TransactionItemProps {
  isMember: boolean;
  txn: Txn | undefined;
  multisigAccount: MultisigAccount;
  membersCount: number;
  chainID: string;
  onViewMoreAction: (txn: Txn) => void;
  isHistory: boolean;
}

interface DialogViewTxnMessagesProps {
  open: boolean;
  isMember: boolean;
  txn: Txn | undefined;
  multisigAccount: MultisigAccount;
  membersCount: number;
  chainID: string;
  toggleMsgDialogOpen: () => void;
  onViewMoreAction: (txn: Txn) => void;
  isHistory: boolean;
}

const mapTxns = {
  '/cosmos.staking.v1beta1.MsgDelegate': 'Delegate',
  '/cosmos.bank.v1beta1.MsgSend': 'Send',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'ReDelegate',
  '/cosmos.staking.v1beta1.MsgUndelegate': 'UnDelegate',
  Msg: 'Tx Msg',
};

const getTxStatusComponent = (status: string, onShowError: () => void) => {
  return (
    <>
      {status === 'SUCCESS' ? (
        <Chip size="small" label="Success" color="success" variant="outlined" />
      ) : (
        <>
          <Chip size="small" label="Failed" color="error" variant="outlined" />
          <Typography
            color="primary"
            variant="body2"
            sx={{
              textDecoration: 'underline',
              mt: 1,
              cursor: 'pointer',
            }}
            onClick={() => onShowError()}
          >
            Error message
          </Typography>
        </>
      )}
    </>
  );
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

  const toggleMsgDialogOpen = () => {
    setMsgDialogOpen((prevState) => !prevState);
  };

  const [selectedTxn, setSelectedTxn] = useState<Txn>();

  const onViewMoreAction = (txn: Txn) => {
    setSelectedTxn(txn);
    setMsgDialogOpen(true);
  };

  return (
    <div className="py-6 space-y-6 text-[14px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between gap-6">
          <div className="flex-1">Messages</div>
          <div className="w-[50px]">Signed</div>
          {isHistory ? <div className="w-[80px]">Status</div> : null}
          <div className={isHistory ? `w-[100px]` : `w-[180px]`}>Actions</div>
        </div>
        <div className="divider"></div>
      </div>
      {txnsState.list.map((txn, index) => (
        <TransactionItem
          key={index}
          isMember={isMember}
          txn={txn}
          multisigAccount={multisigAccount}
          membersCount={members.length}
          chainID={chainID}
          isHistory={isHistory}
          onViewMoreAction={onViewMoreAction}
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
      />
    </div>
  );
};

export default TransactionsList;

const TransactionItem = ({
  isMember,
  txn,
  multisigAccount,
  membersCount,
  chainID,
  onViewMoreAction,
  isHistory,
}: TransactionItemProps) => {
  const threshold = multisigAccount.account.threshold || 0;
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { displayDenom: coinDenom, decimals: coinDecimals } =
    getDenomInfo(chainID);
  const { address: walletAddress } = getChainInfo(chainID);

  const displayDenom = (amountObj: Coin[] | Coin) => {
    if (Array.isArray(amountObj)) {
      return parseTokens(amountObj, coinDenom, coinDecimals);
    } else {
      return parseTokens([amountObj], coinDenom, coinDecimals);
    }
  };

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
        <div className=" truncate">
          {txn?.messages?.length === 0 ? (
            <div>-</div>
          ) : (
            <div>
              {txn?.messages[0].typeUrl === '/cosmos.bank.v1beta1.MsgSend' ? (
                <p>
                  <span className="font-bold">
                    {mapTxns[txn?.messages[0]?.typeUrl]}
                  </span>{' '}
                  &nbsp;
                  <span>{displayDenom(txn?.messages[0]?.value?.amount)}</span>
                  &nbsp;To&nbsp;{' '}
                  <span>
                    {' '}
                    {shortenAddress(txn?.messages[0]?.value?.toAddress, 20)}
                  </span>
                </p>
              ) : null}

              {txn?.messages[0].typeUrl ===
              '/cosmos.staking.v1beta1.MsgDelegate' ? (
                <p>
                  <span className="font-bold">
                    {mapTxns[txn?.messages[0]?.typeUrl]}
                  </span>{' '}
                  <span>{displayDenom(txn?.messages[0]?.value?.amount)}</span>
                  &nbsp; To &nbsp;
                  <span>
                    {shortenAddress(
                      txn?.messages[0]?.value?.validatorAddress,
                      20
                    )}
                  </span>
                </p>
              ) : null}

              {txn?.messages[0].typeUrl ===
              '/cosmos.staking.v1beta1.MsgUndelegate' ? (
                <p>
                  <span className="font-bold">
                    {mapTxns[txn?.messages[0]?.typeUrl]}
                  </span>{' '}
                  <span>{displayDenom(txn?.messages[0]?.value?.amount)}</span>
                  &nbsp; From &nbsp;
                  <span>
                    {shortenAddress(
                      txn?.messages[0]?.value?.validatorAddress,
                      20
                    )}
                  </span>
                </p>
              ) : null}

              {txn?.messages[0].typeUrl ===
              '/cosmos.staking.v1beta1.MsgBeginRedelegate' ? (
                <p>
                  <span className="font-bold">
                    {mapTxns[txn?.messages[0]?.typeUrl]}
                  </span>{' '}
                  <span>{displayDenom(txn?.messages[0]?.value?.amount)}</span>
                  &nbsp;
                  <br />
                  From &nbsp;
                  <span>
                    {shortenAddress(
                      txn?.messages[0]?.value?.validatorSrcAddress,
                      20
                    )}
                  </span>
                  &nbsp; To &nbsp;
                  <span>
                    {shortenAddress(
                      txn?.messages[0]?.value?.validatorDstAddress,
                      20
                    )}
                  </span>
                </p>
              ) : null}
            </div>
          )}
        </div>
        {txn?.messages.length ? (
          <Tooltip title="View More">
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
      <div className="w-[50px] truncate">
        {txn?.signatures?.length || 0}/{membersCount}
      </div>
      {isHistory ? (
        <div className="w-[80px] cursor-pointer">
          {txn?.status === 'SUCCESS' ? (
            <span className='underline underline-offset-2'>Success</span>
          ) : (
            <span className='text-red-500 underline underline-offset-2'>Failed</span>
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
                <BroadCastTxn />
              )
            ) : (
              <SignTxn />
            )}
          </>
        ) : null}
        <div className="relative action-image justify-center flex">
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
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
