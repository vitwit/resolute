import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getMultisigAccounts } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { getLocalTime } from '@/utils/datetime';
import { shortenAddress } from '@/utils/util';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DialogCreateMultisig from './DialogCreateMultisig';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Link from 'next/link';

const AllMultisigs = ({
  address,
  chainName,
  chainID,
}: {
  address: string;
  chainName: string;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const multisigAccounts = useAppSelector(
    (state: RootState) => state.multisig.multisigAccounts
  );
  const accounts = multisigAccounts.accounts;
  const pendingTxns = multisigAccounts.txnCounts;
  const status = multisigAccounts.status;

  const [accountInfo] = useGetAccountInfo(chainID);
  const { pubkey } = accountInfo;
  const { getChainInfo } = useGetChainInfo();
  const { prefix, baseURL } = getChainInfo(chainID);

  useEffect(() => {
    if (address) {
      dispatch(getMultisigAccounts(address));
    }
  }, [address]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="flex-1 pl-10 pt-6 text-white space-y-6">
      <h2 className="text-[20px] leading-normal font-normal">Multisig</h2>
      <div className="flex justify-between items-center">
        <h3>All Accounts</h3>
        <div>
          <button
            className="create-multisig-btn"
            onClick={() => setDialogOpen(true)}
          >
            Create Multisig
          </button>
        </div>
      </div>
      {status !== TxStatus.PENDING && !accounts?.length ? (
        <div className="mt-36 text-[16px] font-medium text-center">
          No Multisig account found on your address
        </div>
      ) : null}
      {status === TxStatus.PENDING ? (
        <div className="mt-36 text-center">
          <CircularProgress size={48} sx={{ color: 'purple' }} />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-6">
        {accounts?.map((account, index) => (
          <MultisigAccountCard
            key={index}
            address={account.address}
            threshold={account.threshold}
            created_at={account.created_at}
            name={account.name}
            actionsRequired={pendingTxns?.[account.address]}
            chainName={chainName}
          />
        ))}
      </div>
      <DialogCreateMultisig
        open={dialogOpen}
        onClose={handleClose}
        addressPrefix={prefix}
        chainID={chainID}
        address={address}
        pubKey={pubkey}
        baseURL={baseURL}
      />
    </div>
  );
};

export default AllMultisigs;

interface MultisigAccountCardProps {
  address: string;
  threshold: number;
  created_at: string;
  name: string;
  actionsRequired: number;
  chainName: string;
}

const MultisigAccountCard = ({
  address,
  threshold,
  created_at,
  name,
  actionsRequired,
  chainName,
}: MultisigAccountCardProps) => {
  return (
    <Link href={`/multisig/${chainName}/${address}`}>
      <div className="space-y-4 text-[14px] multisig-account-card">
        <div className="text-[16px]">{name}</div>
        <div className="space-y-2">
          <div>Address</div>
          <div className="account-address">
            <span className="truncate">{shortenAddress(address, 27)}</span>
            <Image src="/copy.svg" width={24} height={24} alt="copy" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="space-y-2">
            <div>Actions Required</div>
            <div className="text-[16px] leading-[20px] font-bold">
              {actionsRequired}
            </div>
          </div>
          <div className="space-y-2">
            <div>Threshold</div>
            <div className="text-[16px] leading-[20px] font-bold">
              {threshold}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
