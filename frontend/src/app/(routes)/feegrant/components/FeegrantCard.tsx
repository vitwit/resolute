import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { setError } from '@/store/features/common/commonSlice';
import DialogTransactionMessages from './DialogTransactionMessages';
import DialogTransactionDetails from './DialogTransactionDetails';
import CommonCopy from '@/components/CommonCopy';
import { shortenAddress } from '@/utils/util';

interface FeegrantCardprops {
  chainID: string;
  expiration: string;
  address: string;
  spendLimit: string;
  isPeriodic: boolean;
  isGrantsByMe: boolean;
}

const FeegrantCard: React.FC<FeegrantCardprops> = ({
  chainID,
  expiration,
  address,
  spendLimit,
  isPeriodic,
  isGrantsByMe,
}) => {
  const transactionMessages = ['Vote', 'Send', 'Feegrant', 'claimRewards'];
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  const [isDialogTransactionOpen, setIsDialogTransactionOpen] = useState(false);
  const toggleDialogTransaction = () => {
    setIsDialogTransactionOpen(!isDialogTransactionOpen);
  };
  const messageCount = transactionMessages.length;
  // const displayMessages = messageCount > 3 ? transactionMessages.slice(0, 3) : transactionMessages;

  return (
    <div className="feegrant-card">
      <div className="justify-between w-full flex">
        <div className="flex space-x-2 items-center text-capitilize">
          <Image
            className="rounded-full"
            src={networkLogo}
            width={32}
            height={32}
            alt="Network-Logo"
          />
          <p>{getChainName(chainID)}</p>
          {isPeriodic ? (
            <div className="periodic">Periodic</div>
          ) : (
            <div className="basic">Basic</div>
          )}
        </div>
        <div className="feegrant-small-text">
          {' '}
          {isPeriodic ? (
            <div className="">Period Expires in</div>
          ) : (
            <div className="">Expires in </div>
          )}
          {expiration}
        </div>
      </div>
      <div className="justify-between flex w-full">
        <div className="space-y-4">
          <div className="feegrant-small-text">
            {isGrantsByMe ? 'Grantee' : 'Granter'}
          </div>
          <CommonCopy message={shortenAddress(address, 26)} style="max-w-fit" />
        </div>
        <div className="space-y-4">
          <div className="feegrant-small-text">
            {isPeriodic ? (
              <div className="">PeriodSpendLimit</div>
            ) : (
              <div className="">SpendLimit</div>
            )}
          </div>
          <div className="">{spendLimit}</div>
        </div>
      </div>
      <div className="feegrant-small-text">Transaction Message</div>
      <div className="flex flex-wrap gap-6">
        {transactionMessages.length > 0 ? (
          transactionMessages.map((message) => (
            <div
              key={message}
              className="transaction-message-btn cursor-pointer"
              onClick={() => console.log(`Clicked: ${message}`)}
            >
              <p className="feegrant-address">{message}</p>
            </div>
          ))
        ) : (
          <div className="">
            <p className="feegrant-address">All</p>
          </div>
        )}
        {messageCount > 3 && (
          <div className="revoke-btn cursor-pointer" onClick={toggleDialog}>
            +{messageCount - 3}
          </div>
        )}
      </div>
      {isDialogOpen && (
        <DialogTransactionMessages onClose={toggleDialog} open={isDialogOpen} />
      )}
      <div className="flex space-x-6">
        <button className="revoke-btn">Revoke Grant</button>
        {isPeriodic && (
          <button
            className="view-button"
            onClick={() => toggleDialogTransaction()}
          >
            View Transaction
          </button>
        )}
      </div>
      {isDialogTransactionOpen && (
        <DialogTransactionDetails
          onClose={() => setIsDialogTransactionOpen(false)}
          open={isDialogTransactionOpen}
        />
      )}
    </div>
  );
};

export default FeegrantCard;
