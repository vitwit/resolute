import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import MultisigAccountCard from './MultisigAccountCard';

const AllMultisigAccounts = ({ chainName }: { chainName: string }) => {
  const multisigAccounts = useAppSelector(
    (state) => state.multisig.multisigAccounts
  );
  const accounts = multisigAccounts.accounts;
  const pendingTxns = multisigAccounts.txnCounts;
  const status = multisigAccounts.status;

  return (
    <div className="grid grid-cols-3 gap-6 px-6">
      {accounts.map((account) => (
        <MultisigAccountCard
          key={account.address}
          multisigAddress={account.address}
          threshold={account.threshold}
          name={account.name}
          actionsRequired={pendingTxns?.[account.address]}
          chainName={chainName}
        />
      ))}
    </div>
  );
};

export default AllMultisigAccounts;
