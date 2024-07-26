import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import MultisigAccountCard from './MultisigAccountCard';
import { TxStatus } from '@/types/enums';
import EmptyScreen from '@/components/common/EmptyScreen';
import { NO_DATA_ILLUSTRATION } from '@/constants/image-names';
import MultisigAccountsLoading from '../loaders/MultisigAccountsLoading';
import SectionHeader from '@/components/common/SectionHeader';

const AllMultisigAccounts = ({
  chainName,
  setCreateDialogOpen,
}: {
  chainName: string;
  setCreateDialogOpen: () => void;
}) => {
  const multisigAccounts = useAppSelector(
    (state) => state.multisig.multisigAccounts
  );
  const txnsState = useAppSelector((state) => state.multisig.txns.list);
  const accounts = multisigAccounts.accounts;
  const pendingTxns = multisigAccounts.txnCounts;
  const status = multisigAccounts.status;

  return (
    <>
      {status === TxStatus.PENDING ? (
        <MultisigAccountsLoading />
      ) : (
        <div className="space-y-10">
          {txnsState?.length ? (
            <SectionHeader
              title={'Multisig Accounts'}
              description="All multisig accounts you are part of."
            />
          ) : null}
          {accounts?.length ? (
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
          ) : (
            <div className="mt-16">
              <EmptyScreen
                title="No Multisigs"
                description="No multisig accounts found, Go ahead and create one now !"
                btnText="Create Multisig"
                btnOnClick={setCreateDialogOpen}
                hasActionBtn={true}
                bgImage={NO_DATA_ILLUSTRATION}
                height={246}
                width={264}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllMultisigAccounts;
