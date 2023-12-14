import React, { useEffect, useState } from 'react';
import AllMultisigs from './AllMultisigs';
import MultisigSidebar from './MultisigSidebar';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  resetVerifyAccountRes,
  verifyAccount,
} from '@/store/features/multisig/multisigSlice';
import { setAuthToken } from '@/utils/localStorage';
import { setError } from '@/store/features/common/commonSlice';
import VerifyAccount from './VerifyAccount';
import { isVerified } from '@/utils/util';

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
    const timeoutId = 1;
    setTimeout(() => {
      if (!isVerified({ chainID, address }) && chainID?.length) {
        dispatch(
          verifyAccount({
            chainID: chainID,
            address: address,
          })
        );
      }
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [address, chainID]);

  useEffect(() => {
    if (verifyAccountRes.status === 'idle') {
      setAuthToken({
        chainID: chainID,
        address: address,
        signature: verifyAccountRes.token,
      });
      setVerified(true);
      dispatch(resetVerifyAccountRes());
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
    if (isVerified({ chainID, address })) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, [address, chainID]);

  return (
    <div className="flex gap-10">
      {verified ? (
        <AllMultisigs
          address={address}
          chainName={chainName}
          chainID={chainID}
        />
      ) : (
        <VerifyAccount chainID={chainID} walletAddress={address} />
      )}
      <MultisigSidebar
        chainID={chainID}
        walletAddress={address}
        accountSpecific={false}
      />
    </div>
  );
};

export default PageMultisig;
