import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTotalDelegationsCount } from '@/store/features/staking/stakeSlice';
import { ValidatorProfileInfo } from '@/types/staking';
import { formatCommission } from '@/utils/util';
import Link from 'next/link';
import React, { useEffect } from 'react';
import NetworkItem from './NetworkItem';

const ValidatorItem = ({
  validatorInfo,
}: {
  validatorInfo: ValidatorProfileInfo;
}) => {
  const {
    chainID,
    commission,
    rank,
    totalStakedInUSD,
    tokens,
    operatorAddress,
  } = validatorInfo;
  const { getChainInfo } = useGetChainInfo();
  const { chainName, chainLogo, restURLs } = getChainInfo(chainID);
  const dispatch = useAppDispatch();
  const totalDelegators = useAppSelector(
    (state) =>
      state.staking.chains[chainID].validatorProfiles?.[operatorAddress]
        ?.totalDelegators
  );

  const stakingURL = `/staking/${chainName.toLowerCase()}?validator_address=${operatorAddress}&action=delegate`;

  const totalTokens = Number(tokens);
  const votingPower = isNaN(totalTokens)
    ? '-'
    : Number(totalTokens.toFixed(0)).toLocaleString();
  const totalAssets = Number(totalStakedInUSD);
  const totalStaked = isNaN(totalAssets)
    ? '-'
    : Number(totalAssets.toFixed(0)).toLocaleString();
  const delegatorsCount = Number(totalDelegators);
  const totalDelegatorsCount = isNaN(delegatorsCount)
    ? '-'
    : Number(delegatorsCount.toFixed(0)).toLocaleString();

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

  return (
    <tr>
      <td>
        <NetworkItem
          logo={chainLogo}
          networkName={chainName}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{rank}</td>
      <td>{votingPower}</td>
      <td>{totalDelegatorsCount}</td>
      <td>{formatCommission(commission)}</td>
      <td>{'$ ' + totalStaked}</td>
      <td>
        <button className="primary-gradient px-3 py-[6px] w-full rounded-lg">
          <Link href={stakingURL}>Stake</Link>
        </button>
      </td>
    </tr>
  );
};

export default ValidatorItem;
