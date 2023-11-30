import React, { useEffect, useState } from 'react';
import AllMultisigs from './AllMultisigs';
import MultisigSidebar from './MultisigSidebar';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  verifyAccount,
} from '@/store/features/multisig/multisigSlice';
import { getAuthToken, setAuthToken } from '@/utils/localStorage';
import { setError } from '@/store/features/common/commonSlice';

const PageMultisig = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const [verified, setVerified] = useState(false);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const verifyAccountRes = useAppSelector(
    (state) => state.multisig.verifyAccountRes
  );
  const chainID = nameToChainIDs[chainName];

  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);

  useEffect(() => {
    setTimeout(() => {
      if (!isVerified() && chainID?.length) {
        dispatch(
          verifyAccount({
            chainID: chainID,
            address: address,
          })
        );
      }
    }, 1200);
  }, [address, chainID]);

  useEffect(() => {
    if (verifyAccountRes.status === 'idle') {
      setAuthToken({
        chainID: chainID,
        address: address,
        signature: verifyAccountRes.token,
      });
      setVerified(true);
    } else if (verifyAccountRes.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: verifyAccountRes.error,
        })
      );
    }
  }, [verifyAccountRes]);

  useEffect(() => {
    if (isVerified()) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, [address, chainID]);

  const isVerified = () => {
    const token = getAuthToken(chainID);
    if (token) {
      if (token.address === address && token.chainID === chainID) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex gap-10">
      <AllMultisigs address={address} chainName={chainName} chainID={chainID} />
      <MultisigSidebar />
    </div>
  );
};

export default PageMultisig;
