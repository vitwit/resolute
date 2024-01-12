import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import {
  DelegationsPairs,
  TxWithdrawAllRewardsInputs,
} from '@/types/distribution';
import useGetChainInfo from './useGetChainInfo';
import { TxReStakeInputs } from '@/types/staking';
import { Delegate } from '@/txns/staking';
import useAddressConverter from './useAddressConverter';
import { EncodeDelegate } from '@/txns/staking/delegate';

const useGetTxInputs = () => {
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const rewardsChains = useAppSelector(
    (state: RootState) => state.distribution.chains
  );
  const authzRewardsChains = useAppSelector(
    (state) => state.distribution.authzChains
  );
  const { convertAddress } = useAddressConverter();
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { getDenomInfo, getChainInfo } = useGetChainInfo();

  const txWithdrawAllRewardsInputs = (
    chainID: string
  ): TxWithdrawAllRewardsInputs => {
    const delegations =
      stakingChains[chainID].delegations.delegations.delegation_responses;
    const delegationPairs: DelegationsPairs[] = [];

    delegations.forEach((item) => {
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

  const getVoteTxInputs = (chainID: string) => {
    const basicChainInfo = getChainInfo(chainID);
    const {
      aminoConfig,
      prefix,
      rest,
      rpc,
      feeAmount,
      address,
      cosmosAddress,
    } = basicChainInfo;

    const denomInfo = getDenomInfo(chainID);
    const { minimalDenom, decimals } = denomInfo;

    return {
      aminoConfig,
      prefix,
      rest,
      feeAmount: feeAmount * 10 ** decimals,
      address,
      cosmosAddress,
      rpc,
      minimalDenom,
    };
  };

  const txWithdrawValidatorRewardsInputs = (
    chainID: string,
    validatorAddress: string,
    delegatorAddress: string
  ): TxWithdrawAllRewardsInputs => {
    const delegationPairs: DelegationsPairs[] = [
      {
        validator: validatorAddress,
        delegator: delegatorAddress,
      },
    ];

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

  const txRestakeValidatorInputs = (
    chainID: string,
    validatorAddress: string
  ): TxReStakeInputs => {
    const basicChainInfo = getChainInfo(chainID);
    const { minimalDenom, decimals } = getDenomInfo(chainID);
    const rewards = rewardsChains[chainID].delegatorRewards;
    const msgs: Msg[] = [];
    const delegator = basicChainInfo.address;

    for (const delegation of rewards.list) {
      if (delegation?.validator_address === validatorAddress) {
        for (const reward of delegation.reward || []) {
          if (reward.denom === minimalDenom) {
            const amount = parseInt(reward.amount);
            if (amount < 1) continue;
            msgs.push(
              Delegate(delegator, validatorAddress, amount, minimalDenom)
            );
          }
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

  const txSendInputs = (
    chainID: string,
    recipient: string,
    amount: number,
    memo: string,
    assetDenom: string,
    decimals: number
  ): TxSendInputs => {
    const basicChainInfo = getChainInfo(chainID);
    const { minimalDenom } = getDenomInfo(chainID);
    return {
      basicChainInfo,
      from: basicChainInfo.address,
      to: recipient,
      assetDenom,
      amount: amount * 10 ** decimals,
      denom: minimalDenom,
      feeAmount: basicChainInfo.feeAmount * 10 ** decimals,
      feegranter: '',
      memo,
      prefix: basicChainInfo.prefix,
    };
  };

  const txTransferInputs = (
    chainID: string,
    destChainID: string,
    to: string,
    amount: number,
    denom: string,
    decimals: number
  ) => {
    const sourceBasicChainInfo = getChainInfo(chainID);
    const destBasicChainInfo = getChainInfo(destChainID);
    const transfersRequestInputs: TransferRequestInputs = {
      cosmosAddress: sourceBasicChainInfo.cosmosAddress,
      sourceChain: sourceBasicChainInfo.chainName,
      sourceChainID: chainID,
      destChain: destBasicChainInfo.chainName,
      destChainID: destChainID,
      amount: (amount * 10 ** decimals).toString(),
      sourceDenom: denom,
      from: sourceBasicChainInfo.address,
      to,
      rest: sourceBasicChainInfo.rest,
    };

    return transfersRequestInputs;
  };

  const txAuthzRestakeMsgs = (chainID: string): Msg[] => {
    const { minimalDenom } = getDenomInfo(chainID);
    const rewards = authzRewardsChains[chainID]?.delegatorRewards;
    const msgs: Msg[] = [];
    if (!isAuthzMode) return [];
    const delegator = convertAddress(chainID, authzAddress);

    for (const delegation of rewards?.list || []) {
      for (const reward of delegation.reward || []) {
        if (reward.denom === minimalDenom) {
          const amount = parseInt(reward.amount);
          if (amount < 1) continue;
          const msg = EncodeDelegate(
            delegator,
            delegation.validator_address,
            amount,
            minimalDenom
          );
          msgs.push(msg);
        }
      }
    }
    return msgs;
  };

  const txAuthzRestakeValidatorMsgs = (
    chainID: string,
    validatorAddress: string
  ): Msg[] => {
    if (!isAuthzMode) return [];
    const { minimalDenom } = getDenomInfo(chainID);
    const rewards = authzRewardsChains[chainID]?.delegatorRewards;
    const msgs: Msg[] = [];
    const delegator = convertAddress(chainID, authzAddress);

    for (const delegation of rewards.list) {
      if (delegation?.validator_address === validatorAddress) {
        for (const reward of delegation.reward || []) {
          if (reward.denom === minimalDenom) {
            const amount = +reward.amount;
            if (amount < 1) continue;
            msgs.push(
              EncodeDelegate(delegator, validatorAddress, amount, minimalDenom)
            );
          }
        }
      }
    }

    return msgs;
  };

  return {
    txWithdrawAllRewardsInputs,
    txRestakeInputs,
    txWithdrawValidatorRewardsInputs,
    txRestakeValidatorInputs,
    txSendInputs,
    getVoteTxInputs,
    txTransferInputs,
    txAuthzRestakeMsgs,
    txAuthzRestakeValidatorMsgs,
  };
};

export default useGetTxInputs;
