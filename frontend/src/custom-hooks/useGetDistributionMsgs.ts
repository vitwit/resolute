import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import { WithdrawValidatorCommissionMsg } from '@/txns/distribution/withDrawValidatorCommission';
import useGetTxInputs from './useGetTxInputs';
import { WithdrawAllRewardsMsg } from '@/txns/distribution/withDrawRewards';

const useGetDistributionMsgs = () => {
  const { txWithdrawAllRewardsInputs } = useGetTxInputs();
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const getWithdrawCommissionAndRewardsMsgs = ({
    chainID,
  }: {
    chainID: string;
  }) => {
    const validator = stakingData?.[chainID].validator;
    const msgs = [];
    const withdrawCommissionMsg = WithdrawValidatorCommissionMsg(
      validator.validatorInfo?.operator_address || ''
    );
    msgs.push(withdrawCommissionMsg);
    const delegationPairs = txWithdrawAllRewardsInputs(chainID);
    for (let i = 0; i < delegationPairs.msgs.length; i++) {
      const msg = delegationPairs.msgs[i];
      msgs.push(WithdrawAllRewardsMsg(msg.delegator, msg.validator));
    }

    return msgs;
  };

  return {
    getWithdrawCommissionAndRewardsMsgs,
  };
};

export default useGetDistributionMsgs;
