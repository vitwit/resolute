import SectionHeader from '@/components/common/SectionHeader';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useMemo, useState } from 'react';
import { Txn } from '@/types/multisig';
import TxnMsg from '../msgs/TxnMsg';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  DROP_DOWN_CLOSE,
  DROP_DOWN_OPEN,
  MENU_ICON,
} from '@/constants/image-names';
import Image from 'next/image';
import LetterAvatar from '@/components/common/LetterAvatar';
import SignTxn from '../SignTxn';
import { isMultisigMember } from '@/utils/util';
import BroadCastTxn from '../BroadCastTxn';

const RecentTransactions = ({ chainID }: { chainID: string }) => {
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const multisigAccounts = useAppSelector(
    (state) => state.multisig.multisigAccounts
  );
  const accounts = multisigAccounts.accounts;
  const txnsState = useAppSelector((state) => state.multisig.txns.list);

  const currency = useMemo(
    () => ({
      coinMinimalDenom: minimalDenom,
      coinDecimals: decimals,
      coinDenom: displayDenom,
    }),
    [minimalDenom, decimals, displayDenom]
  );

  return (
    <>
      {txnsState?.length ? (
        <div>
          <SectionHeader
            title={'Recent Transactions'}
            description="Recent transactions from all multisig accounts"
          />
          <div className="px-6 mt-10 space-y-10">
            {accounts.map((account) => {
              const txns = txnsState.filter(
                (txn) => txn.multisig_address === account.address
              );
              return (
                <>
                  {txns?.length ? (
                    <MultisigAccountRecentTxns
                      key={account.address}
                      actionsRequired={txns.length}
                      multisigName={account.name}
                      txns={txns}
                      currency={currency}
                      threshold={account.threshold}
                      multisigAddress={account.address}
                      chainID={chainID}
                    />
                  ) : null}
                </>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RecentTransactions;

const MultisigAccountRecentTxns = ({
  actionsRequired,
  multisigName,
  txns,
  currency,
  threshold,
  multisigAddress,
  chainID,
}: {
  multisigName: string;
  actionsRequired: number;
  txns: Txn[];
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LetterAvatar name={multisigName} height="40px" width="40px" />
          <div className="text-b1">{multisigName}</div>
        </div>
        <div className="actions-required-badge">
          {actionsRequired} Actions Required
        </div>
      </div>
      <div className="space-y-4">
        {txns.map((txn, index) => (
          <TxnsCard
            key={index}
            txn={txn}
            currency={currency}
            threshold={threshold}
            multisigAddress={multisigAddress}
            chainID={chainID}
          />
        ))}
      </div>
    </div>
  );
};

const TxnsCard = ({
  txn,
  currency,
  threshold,
  multisigAddress,
  chainID,
}: {
  txn: Txn;
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
}) => {
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const [showAll, setShowAll] = useState(false);
  const { messages } = txn;
  const pubKeys = txn.pubkeys || [];
  const isMember = isMultisigMember(pubKeys, walletAddress);
  const isReadyToBroadcast = () => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  return (
    <div className="txn-card">
      <div className="space-y-2">
        <div className="text-small-light">Transaction Messages</div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="text-b1">#1</div>
              <TxnMsg msg={messages[0]} currency={currency} />
            </div>
            {messages?.length > 1 ? (
              <ExpandViewButton
                showAll={showAll}
                toggleView={() => setShowAll((prev) => !prev)}
              />
            ) : null}
          </div>
          {showAll
            ? messages.slice(1, messages?.length).map((msg, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <div className="font-bold">{`#${index + 2}`}</div>
                    <TxnMsg msg={msg} currency={currency} />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-small-light">Signed</div>
        <div className="flex gap-[2px] items-end">
          <span className="text-b1">{txn.signatures.length}</span>
          <span className="text-small-light">/</span>
          <span className="text-small-light">{pubKeys.length}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-6">
          {isReadyToBroadcast() ? (
            <BroadCastTxn
              txn={txn}
              multisigAddress={multisigAddress}
              pubKeys={txn.pubkeys || []}
              threshold={threshold}
              chainID={chainID}
              isMember={isMember}
            />
          ) : (
            <SignTxn
              address={multisigAddress}
              chainID={chainID}
              isMember={isMember}
              txId={txn.id}
              unSignedTxn={txn}
            />
          )}
          <button>
            <Image src={MENU_ICON} height={24} width={24} alt="Menu" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpandViewButton = ({
  showAll,
  toggleView,
}: {
  showAll: boolean;
  toggleView: () => void;
}) => {
  return (
    <Image
      className="cursor-pointer"
      onClick={() => toggleView()}
      src={showAll ? DROP_DOWN_CLOSE : DROP_DOWN_OPEN}
      width={16}
      height={16}
      alt=""
    />
  );
};
