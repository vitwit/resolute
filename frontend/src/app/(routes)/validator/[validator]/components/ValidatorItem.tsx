import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getTotalDelegationsCount } from '@/store/features/staking/stakeSlice';
import { ValidatorProfileInfo } from '@/types/staking';
import { formatCommission, formatValidatorStatsValue } from '@/utils/util';
import React, { useEffect } from 'react';
import NetworkItem from './NetworkItem';
import useGetAllChainsInfo from '@/custom-hooks/useGetAllChainsInfo';
import { Tooltip } from '@mui/material';

const ValidatorItem = ({
  validatorInfo,
}: {
  validatorInfo: ValidatorProfileInfo;
}) => {
  const { chainID, commission, totalStakedInUSD, tokens, operatorAddress } =
    validatorInfo;
  const { getAllChainInfo } = useGetAllChainsInfo();
  const { chainName, chainLogo, restURLs } = getAllChainInfo(chainID);
  const dispatch = useAppDispatch();

  const totalDelegators = useAppSelector(
    (state) =>
      state.staking.chains[chainID].validatorProfiles?.[operatorAddress]
        ?.totalDelegators
  );
  const votingPower = formatValidatorStatsValue(tokens, 0);
  const totalStaked = formatValidatorStatsValue(totalStakedInUSD, 0);
  const totalDelegatorsCount = formatValidatorStatsValue(totalDelegators, 0);

  const connected = useAppSelector((state) => state.wallet.connected);

  useEffect(() => {
    if (operatorAddress?.length) {
      dispatch(
        getTotalDelegationsCount({
          baseURLs: restURLs,
          chainID,
          operatorAddress,
        })
      );
    }
  }, [operatorAddress]);

  const handleDelegate = () => {
    // TODO: open delegate dialog box and allow user to delegate from this page
  };

  return (
    <tr className="hover:bg-[#FFFFFF14]">
      <td>
        <NetworkItem
          logo={chainLogo}
          networkName={chainName}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{votingPower}</td>
      <td>{totalDelegatorsCount !== '0' ? totalDelegatorsCount : '-'}</td>
      <td>{formatCommission(commission)}</td>
      <td>{'$ ' + totalStaked}</td>
      <td className="w-[7%]">
        {connected ? (
          <button onClick={handleDelegate} className="primary-btn">
            Stake
          </button>
        ) : (
          <Tooltip title="Connect wallet to stake">
            <button className="primary-btn !opacity-50">Stake</button>
          </Tooltip>
        )}
      </td>
    </tr>
  );
};

export default ValidatorItem;
