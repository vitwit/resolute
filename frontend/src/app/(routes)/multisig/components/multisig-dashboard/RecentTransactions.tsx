import SectionHeader from '@/components/common/SectionHeader';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useMemo } from 'react';
import { Txn } from '@/types/multisig';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import LetterAvatar from '@/components/common/LetterAvatar';
import TxnsCard from '../common/TxnsCard';

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
            isHistory={false}
          />
        ))}
      </div>
    </div>
  );
};
