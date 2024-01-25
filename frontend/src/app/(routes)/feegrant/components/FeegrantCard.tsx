import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { setError } from '@/store/features/common/commonSlice';
import DialogTransactionMessages from './DialogTransactionMessages';
import DialogTransactionDetails from './DialogTransactionDetails';

interface FeegrantCardprops {
  chainID: string;
  expiration: string;
  address: string;
  spendLimit: string;
  isPeriodic: boolean;
}

const FeegrantCard: React.FC<FeegrantCardprops> = ({
  chainID,
  expiration,
  address,
  spendLimit,
  isPeriodic,
}) => {
  const transactionMessages = ['Vote', 'Send', 'Feegrant'];
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
  const cardType = 'periodic';

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
          {cardType === 'periodic' ? 'Period Expires in' : 'Expires in'}{' '}
          {expiration}
        </div>
      </div>
      <div className="w-full justify-between flex">
        <div className="space-y-4">
          <div className="feegrant-small-text">Grantee</div>
          <div className="feegrant-address truncate">
            <p>{address}</p>
            <Image
              onClick={(e) => {
                copyToClipboard(address);
                dispatch(
                  setError({
                    type: 'success',
                    message: 'Copied',
                  })
                );
                e.preventDefault();
                e.stopPropagation();
              }}
              src="/copy.svg"
              width={24}
              height={24}
              alt="copy"
              draggable={false}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="feegrant-small-text">
            {cardType === 'periodic' ? 'PeriodSpendLimit' : 'SpendLimit'}
          </div>
          <div className="">{spendLimit}</div>
        </div>
      </div>
      <div className="feegrant-small-text">Transaction Message</div>
      <div className="flex flex-wrap gap-6">
        {cardType === 'periodic' ? (
          <div className="transaction-message-btn cursor-pointer">
            <p className="feegrant-address">All</p>
          </div>
        ) : (
          transactionMessages.map((message) => (
            <div
              key={message}
              className="transaction-message-btn cursor-pointer"
              onClick={() => console.log(`Clicked: ${message}`)}
            >
              <p className="feegrant-address">{message}</p>
            </div>
          ))
        )}
        {!isDialogOpen && cardType !== 'periodic' && (
          <div className="revoke-btn cursor-pointer" onClick={toggleDialog}>
            +3
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
