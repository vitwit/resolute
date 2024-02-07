import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import {
  EncodedWithdrawValidatorCommissionMsg,
  WithdrawValidatorCommissionMsg,
} from '@/txns/distribution/withDrawValidatorCommission';
import useGetTxInputs from './useGetTxInputs';
import {
  EncodedWithdrawAllRewardsMsg,
  WithdrawAllRewardsMsg,
} from '@/txns/distribution/withDrawRewards';
import {
  DelegationsPairs,
  TxWithdrawAllRewardsInputs,
} from '@/types/distribution';
import useGetChainInfo from './useGetChainInfo';
import {
  EncodedSetWithdrawAddressMsg,
  SetWithdrawAddressMsg,
} from '@/txns/distribution/setWithdrawAddress';

const useGetDistributionMsgs = () => {
  const { txWithdrawAllRewardsInputs } = useGetTxInputs();
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const authzStakingData = useAppSelector(
    (state) => state.staking.authz.chains
  );
  const authzRewards = useAppSelector(
    (state) => state.distribution.authzChains
  );
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const { getChainInfo } = useGetChainInfo();

  const getWithdrawCommissionAndRewardsMsgs = ({
    chainID,
  }: {
    chainID: string;
  }) => {
    const validator = isAuthzMode
      ? authzStakingData?.[chainID].validator
      : stakingData?.[chainID].validator;
    const msgs = [];
    const withdrawCommissionMsg = isAuthzMode
      ? EncodedWithdrawValidatorCommissionMsg(
          validator.validatorInfo?.operator_address || ''
        )
      : WithdrawValidatorCommissionMsg(
          validator.validatorInfo?.operator_address || ''
        );
    msgs.push(withdrawCommissionMsg);

    let delegationPairs: DelegationsPairs[] | TxWithdrawAllRewardsInputs;
    if (isAuthzMode) {
      delegationPairs = (
        authzRewards[chainID]?.delegatorRewards?.list || []
      ).map((reward) => {
        const pair = {
          delegator: authzAddress,
          validator: reward.validator_address,
        };
        return pair;
      });
      for (let i = 0; i < delegationPairs.length; i++) {
        const msg = delegationPairs[i];
        msgs.push(EncodedWithdrawAllRewardsMsg(msg.delegator, msg.validator));
      }
    } else {
      delegationPairs = txWithdrawAllRewardsInputs(chainID);
      for (let i = 0; i < delegationPairs.msgs.length; i++) {
        const msg = delegationPairs.msgs[i];
        msgs.push(WithdrawAllRewardsMsg(msg.delegator, msg.validator));
      }
    }

    return msgs;
  };

  const getWithdrawCommissionMsgs = ({ chainID }: { chainID: string }) => {
    const validator = isAuthzMode
      ? authzStakingData?.[chainID].validator
      : stakingData?.[chainID].validator;
    const msgs = [];
    const withdrawCommissionMsg = isAuthzMode
      ? EncodedWithdrawValidatorCommissionMsg(
          validator.validatorInfo?.operator_address || ''
        )
      : WithdrawValidatorCommissionMsg(
          validator.validatorInfo?.operator_address || ''
        );
    msgs.push(withdrawCommissionMsg);
    return msgs;
  };

  const getWithdrawRewardsMsgs = ({ chainID }: { chainID: string }) => {
    const msgs = [];

    let delegationPairs: DelegationsPairs[] | TxWithdrawAllRewardsInputs;
    if (isAuthzMode) {
      delegationPairs = (
        authzRewards[chainID]?.delegatorRewards?.list || []
      ).map((reward) => {
        const pair = {
          delegator: authzAddress,
          validator: reward.validator_address,
        };
        return pair;
      });
      for (let i = 0; i < delegationPairs.length; i++) {
        const msg = delegationPairs[i];
        msgs.push(EncodedWithdrawAllRewardsMsg(msg.delegator, msg.validator));
      }
    } else {
      delegationPairs = txWithdrawAllRewardsInputs(chainID);
      for (let i = 0; i < delegationPairs.msgs.length; i++) {
        const msg = delegationPairs.msgs[i];
        msgs.push(WithdrawAllRewardsMsg(msg.delegator, msg.validator));
      }
    }

    return msgs;
  };

  const getSetWithdrawAddressMsg = ({
    chainID,
    withdrawAddress,
  }: {
    chainID: string;
    withdrawAddress: string;
  }) => {
    const { address } = getChainInfo(chainID);
    let msg;
    if (isAuthzMode) {
      msg = EncodedSetWithdrawAddressMsg(authzAddress, withdrawAddress);
    } else {
      msg = SetWithdrawAddressMsg(address, withdrawAddress);
    }
    return msg;
  };

  return {
    getWithdrawCommissionMsgs,
    getWithdrawRewardsMsgs,
    getSetWithdrawAddressMsg,
    getWithdrawCommissionAndRewardsMsgs,
  };
};

export default useGetDistributionMsgs;
