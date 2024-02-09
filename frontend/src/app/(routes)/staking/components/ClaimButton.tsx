import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { txWithdrawValidatorCommissionAndRewards } from '@/store/features/distribution/distributionSlice';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetDistributionMsgs from '@/custom-hooks/useGetDistributionMsgs';
import useGetWithdrawPermissions from '@/custom-hooks/useGetWithdrawPermissions';
import WithdrawActions from './WithdrawActions';

const ClaimButton = ({
  chainID,
  claimRewards,
}: {
  chainID: string;
  claimRewards: () => void;
}) => {
  const { txWithdrawCommissionAndRewardsInputs } = useGetTxInputs();
  const { getWithdrawCommissionAndRewardsMsgs } = useGetDistributionMsgs();
  const { getChainInfo } = useGetChainInfo();
  const { txAuthzWithdrawRewardsAndCommission } = useAuthzStakingExecHelper();
  const { getWithdrawPermissions } = useGetWithdrawPermissions();
  const dispatch = useAppDispatch();

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const authzStakingData = useAppSelector(
    (state: RootState) => state.staking.authz.chains
  );
  const { withdrawCommissionAllowed, withdrawRewardsAllowed } =
    getWithdrawPermissions({ chainID, granter: authzAddress });

  const isAuthzValidator = authzStakingData?.[chainID]?.validator?.validatorInfo
    ?.operator_address
    ? true
    : false;

  const isSelfValidator = stakingData?.[chainID]?.validator?.validatorInfo
    ?.operator_address
    ? true
    : false;

  const { address } = getChainInfo(chainID);

  const claimRewardsAndCommission = () => {
    if (isAuthzMode) {
      txAuthzWithdrawRewardsAndCommission({
        chainID: chainID,
        grantee: address,
        granter: authzAddress,
      });
    } else {
      const msgs = getWithdrawCommissionAndRewardsMsgs({ chainID });
      const txInputs = txWithdrawCommissionAndRewardsInputs(chainID, msgs);
      dispatch(txWithdrawValidatorCommissionAndRewards(txInputs));
    }
  };

  const withdrawCommissionLoading = useAppSelector(
    (state) => state.distribution.chains?.[chainID]?.txWithdrawCommission.status
  );

  const withdrawRewardsLoading = useAppSelector(
    (state) => state.distribution.chains?.[chainID]?.tx.status
  );

  return (
    <>
      <WithdrawActions
        claimRewards={claimRewards}
        claimRewardsAndCommission={claimRewardsAndCommission}
        isAuthzMode={isAuthzMode}
        isSelfValidator={isSelfValidator}
        isAuthzValidator={isAuthzValidator}
        withdrawCommissionLoading={withdrawCommissionLoading}
        withdrawRewardsAllowed={withdrawRewardsAllowed}
        withdrawRewardsLoading={withdrawRewardsLoading}
        withdrawCommissionAllowed={withdrawCommissionAllowed}
      />
    </>
  );
};

export default ClaimButton;
