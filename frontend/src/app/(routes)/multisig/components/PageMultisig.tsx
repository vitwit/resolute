import React, { useEffect } from 'react';
import AllMultisigs from './AllMultisigs';
import MultisigSidebar from './MultisigSidebar';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  resetDeleteMultisigRes,
} from '@/store/features/multisig/multisigSlice';
import { resetError } from '@/store/features/common/commonSlice';
import DialogVerifyAccount from './DialogVerifyAccount';

const PageMultisig = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];

  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);

  useEffect(() => {
    dispatch(resetError());
    dispatch(resetDeleteMultisigRes());
  }, []);

  useEffect(() => {
    if (address) dispatch(getMultisigAccounts(address));
  }, []);

  return (
    <div className="flex gap-10">
      <AllMultisigs address={address} chainName={chainName} chainID={chainID} />
      <MultisigSidebar
        chainID={chainID}
        walletAddress={address}
        accountSpecific={false}
      />
      <DialogVerifyAccount address={address} chainID={chainID} />
    </div>
  );
};

export default PageMultisig;
