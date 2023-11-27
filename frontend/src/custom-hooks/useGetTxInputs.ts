import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import {
  DelegationsPairs,
  TxWithdrawAllRewardsInputs,
} from '@/types/distribution';
import useGetChainInfo from './useGetChainInfo';
import { TxReStakeInputs } from '@/types/staking';
import { Delegate } from '@/txns/staking';

const useGetTxInputs = () => {
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const rewardsChains = useAppSelector(
    (state: RootState) => state.distribution.chains
  );
  const { getDenomInfo, getChainInfo } = useGetChainInfo();

  const txWithdrawAllRewardsInputs = (
    chainID: string
  ): TxWithdrawAllRewardsInputs => {
    const delegations = stakingChains[chainID];
    let delegationPairs: DelegationsPairs[] = [];
    delegations.delegations.delegations.delegation_responses.forEach((item) => {
      delegationPairs.push({
        validator: item.delegation.validator_address,
        delegator: item.delegation.delegator_address,
      });
    });
    const { minimalDenom, decimals } = getDenomInfo(chainID);
    const basicChainInfo = getChainInfo(chainID);
    const { aminoConfig, prefix, rest, feeAmount, address, cosmosAddress } =
      basicChainInfo;

    return {
      msgs: delegationPairs,
      denom: minimalDenom,
      chainID,
      aminoConfig,
      prefix,
      rest,
      feeAmount: feeAmount * 10 ** decimals,
      feegranter: '',
      address,
      cosmosAddress,
    };
  };

  const txRestakeInputs = (chainID: string): TxReStakeInputs => {
    const basicChainInfo = getChainInfo(chainID);
    const { minimalDenom, decimals } = getDenomInfo(chainID);
    const rewards = rewardsChains[chainID].delegatorRewards;
    const msgs: Msg[] = [];
    const delegator = basicChainInfo.address;

    for (const delegation of rewards.list) {
      for (const reward of delegation.reward || []) {
        if (reward.denom === minimalDenom) {
          const amount = parseInt(reward.amount);
          if (amount < 1) continue;
          msgs.push(
            Delegate(
              delegator,
              delegation.validator_address,
              amount,
              minimalDenom
            )
          );
        }
      }
    }

    return {
      msgs: msgs,
      basicChainInfo,
      memo: '',
      denom: minimalDenom,
      feeAmount: basicChainInfo.feeAmount * 10 ** decimals,
      feegranter: '',
    };
  };

  return { txWithdrawAllRewardsInputs, txRestakeInputs };
};

export default useGetTxInputs;
