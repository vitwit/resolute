import React, { useEffect } from 'react';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  getMultisigBalance,
  multisigByAddress,
} from '@/store/features/multisig/multisigSlice';
import {
  resetError,
  setSelectedNetwork,
} from '@/store/features/common/commonSlice';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import AccountInfo from './AccountInfo';
import MultisigSidebar from './MultisigSidebar';
import DialogVerifyAccount from './DialogVerifyAccount';

interface PageMultisigInfoProps {
  chainName: string;
  address: string;
}

const PageMultisigInfo: React.FC<PageMultisigInfoProps> = (props) => {
  const { chainName, address } = props;
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainID = nameToChainIDs[chainName];

  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { address: walletAddress, baseURL, restURLs } = getChainInfo(chainID);
  const {
    minimalDenom: coinMinimalDenom,
    decimals: coinDecimals,
    displayDenom: coinDenom,
  } = getDenomInfo(chainID);

  useEffect(() => {
    if (chainID) {
      dispatch(
        getMultisigBalance({
          baseURL,
          address,
          denom: coinMinimalDenom,
          baseURLs: restURLs,
        })
      );
      dispatch(getDelegations({ baseURLs: restURLs, address, chainID }));
      dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
      dispatch(multisigByAddress({ address }));
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [chainID]);

  useEffect(() => {
    dispatch(setSelectedNetwork({ chainName: chainName }));
  }, [chainName]);

  useEffect(() => {
    dispatch(resetError());
  }, []);

  return (
    <div className="flex gap-10 justify-between">
      <AccountInfo
        chainID={chainID}
        chainName={chainName}
        address={address}
        coinMinimalDenom={coinMinimalDenom}
        coinDecimals={coinDecimals}
        coinDenom={coinDenom}
        walletAddress={walletAddress}
      />
      <MultisigSidebar
        chainID={chainID}
        accountSpecific={true}
        address={address}
        walletAddress={walletAddress}
      />
      <DialogVerifyAccount address={walletAddress} />
    </div>
  );
};

export default PageMultisigInfo;
