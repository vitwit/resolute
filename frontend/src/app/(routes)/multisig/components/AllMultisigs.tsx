import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getMultisigAccounts,
  resetCreateMultisigRes,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { shortenAddress } from '@/utils/util';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DialogCreateMultisig from './DialogCreateMultisig';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Link from 'next/link';

interface AllMultisigsProps {
  address: string;
  chainName: string;
  chainID: string;
}

const AllMultisigs: React.FC<AllMultisigsProps> = (props) => {
  const { address, chainName, chainID } = props;
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const multisigAccounts = useAppSelector(
    (state: RootState) => state.multisig.multisigAccounts
  );
  const createMultiAccRes = useAppSelector(
    (state: RootState) => state.multisig.createMultisigAccountRes
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

  useEffect(() => {
    if (createMultiAccRes.status === 'idle') {
      setDialogOpen(false);
      dispatch(getMultisigAccounts(address));
      dispatch(resetCreateMultisigRes());
    }
  }, [createMultiAccRes]);

  return (
    <div className="flex-1 pl-10 py-6 text-white space-y-6 max-h-screen overflow-y-scroll">
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
      {status !== TxStatus.PENDING && !accounts?.length && (
        <div className="mt-36 text-[16px] font-medium text-center">
          No Multisig account found on your address
        </div>
      )}
      {status === TxStatus.PENDING ? (
        <div className="mt-36 text-center">
          <CircularProgress size={48} className="circular-progress-custom" />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-6">
        {accounts?.map((account) => (
          <MultisigAccountCard
            key={account.address}
            address={account.address}
            threshold={account.threshold}
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
  name: string;
  actionsRequired: number;
  chainName: string;
}

const MultisigAccountCard = ({
  address,
  threshold,
  name,
  actionsRequired,
  chainName,
}: MultisigAccountCardProps) => {
  return (
    <Link href={`/multisig/${chainName}/${address}`}>
      <div className="space-y-5 text-[14px] multisig-account-card">
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
