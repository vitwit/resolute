import React, { useEffect, useState } from 'react';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  getMultisigBalance,
  multisigByAddress,
  verifyAccount,
} from '@/store/features/multisig/multisigSlice';
import { getAuthToken, setAuthToken } from '@/utils/localStorage';
import { setError } from '@/store/features/common/commonSlice';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import AccountInfo from './AccountInfo';
import MultisigSidebar from './MultisigSidebar';

const PageMultisigInfo = ({
  chainName,
  address,
}: {
  chainName: string;
  address: string;
}) => {
  const dispatch = useAppDispatch();
  const [verified, setVerified] = useState(false);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const verifyAccountRes = useAppSelector(
    (state) => state.multisig.verifyAccountRes
  );
  const chainID = nameToChainIDs[chainName];

  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { address: walletAddress, baseURL } = getChainInfo(chainID);
  const { minimalDenom: denom } = getDenomInfo(chainID);

  useEffect(() => {
    setTimeout(() => {
      if (!isVerified() && chainID?.length) {
        dispatch(
          verifyAccount({
            chainID: chainID,
            address: walletAddress,
          })
        );
      }
    }, 1200);
  }, [walletAddress, chainID]);

  useEffect(() => {
    if (verifyAccountRes.status === 'idle') {
      setAuthToken({
        chainID: chainID,
        address: walletAddress,
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

  useEffect(() => {
    if (chainID && isVerified()) {
      dispatch(getMultisigBalance({ baseURL, address, denom }));
      dispatch(getDelegations({ baseURL, address, chainID }));
      dispatch(getAllValidators({ baseURL, chainID }));
      dispatch(multisigByAddress({ address }));
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [chainID]);

  const isVerified = () => {
    const token = getAuthToken(chainID);
    if (token) {
      if (token.address === walletAddress && token.chainID === chainID) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex gap-10 justify-between">
      <AccountInfo chainName={chainName} address={address} />
      <MultisigSidebar />
    </div>
  );
};

export default PageMultisigInfo;
