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
import { setAuthToken } from '@/utils/localStorage';
import {
  setError,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import AccountInfo from './AccountInfo';
import MultisigSidebar from './MultisigSidebar';
import VerifyAccount from './VerifyAccount';
import { isVerified } from '@/utils/util';

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
  const {
    minimalDenom: coinMinimalDenom,
    decimals: coinDecimals,
    displayDenom: coinDenom,
  } = getDenomInfo(chainID);

  useEffect(() => {
    const timeoutId = 1;
    setTimeout(() => {
      if (!isVerified({ chainID, address: walletAddress }) && chainID?.length) {
        dispatch(
          verifyAccount({
            chainID: chainID,
            address: walletAddress,
          })
        );
      }
    }, 1200);
    return () => clearTimeout(timeoutId);
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
    if (isVerified({ chainID, address: walletAddress })) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, [address, chainID]);

  useEffect(() => {
    if (chainID && isVerified({ chainID, address: walletAddress })) {
      dispatch(
        getMultisigBalance({ baseURL, address, denom: coinMinimalDenom })
      );
      dispatch(getDelegations({ baseURL, address, chainID }));
      dispatch(getAllValidators({ baseURL, chainID }));
      dispatch(multisigByAddress({ address }));
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [chainID, verifyAccountRes]);

  useEffect(() => {
    dispatch(setSelectedNetwork({ chainName: chainName }));
  }, [chainName]);

  return (
    <div className="flex gap-10 justify-between">
      {verified ? (
        <AccountInfo
          chainID={chainID}
          chainName={chainName}
          address={address}
          coinMinimalDenom={coinMinimalDenom}
          coinDecimals={coinDecimals}
          coinDenom={coinDenom}
        />
      ) : (
        <VerifyAccount chainID={chainID} walletAddress={walletAddress} />
      )}
      <MultisigSidebar
        chainID={chainID}
        accountSpecific={true}
        address={address}
        walletAddress={walletAddress}
      />
    </div>
  );
};

export default PageMultisigInfo;
