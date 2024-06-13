import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import MultisigAccountCard from './MultisigAccountCard';
import { TxStatus } from '@/types/enums';
import CustomLoader from '@/components/common/CustomLoader';
import EmptyScreen from '@/components/common/EmptyScreen';
import { NO_DATA_ILLUSTRATION } from '@/constants/image-names';

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
  const accounts = multisigAccounts.accounts;
  const pendingTxns = multisigAccounts.txnCounts;
  const status = multisigAccounts.status;

  return (
    <>
      {status === TxStatus.PENDING ? (
        <div className="flex my-32 items-center justify-center w-full">
          <CustomLoader />
        </div>
      ) : (
        <div>
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
                height={400}
                width={400}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllMultisigAccounts;
