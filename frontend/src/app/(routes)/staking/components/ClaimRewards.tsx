import React from 'react';
import { StakingCardActionButton } from './StakingCard';
import { TxStatus } from '@/types/enums';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetWithdrawPermissions from '@/custom-hooks/useGetWithdrawPermissions';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetDistributionMsgs from '@/custom-hooks/useGetDistributionMsgs';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txWithdrawValidatorCommissionAndRewards } from '@/store/features/distribution/distributionSlice';

interface ClaimRewardsProps {
  claim: () => void;
  txClaimStatus: TxStatus;
  validatorAddress: string;
  processingValAddr: string;
  isClaimAll: boolean;
  enable: boolean;
  chainID: string;
}

const ClaimRewards = ({
  claim,
  enable,
  isClaimAll,
  processingValAddr,
  txClaimStatus,
  validatorAddress,
  chainID,
}: ClaimRewardsProps) => {
  const dispatch = useAppDispatch();
  const { getWithdrawPermissions } = useGetWithdrawPermissions();
  const { txAuthzWithdrawRewardsAndCommission } = useAuthzStakingExecHelper();
  const { getWithdrawValidatorCommisionAndRewardsMsgs } =
    useGetDistributionMsgs();
  const { txWithdrawCommissionAndRewardsInputs } = useGetTxInputs();
  const { getChainInfo } = useGetChainInfo();

  const { address } = getChainInfo(chainID);

  const stakingData = useAppSelector((state) => state.staking.chains);
  const authzStakingData = useAppSelector(
    (state) => state.staking.authz.chains
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

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

  const canAuthzClaimCommission =
    isAuthzValidator && isAuthzMode && withdrawCommissionAllowed;
  const canAuthzClaimRewardsCommission =
    canAuthzClaimCommission && withdrawRewardsAllowed;

  const isNotValidator = !isSelfValidator && !isAuthzValidator;

  const claimRewardsAndCommission = () => {
    if (isAuthzMode) {
      txAuthzWithdrawRewardsAndCommission({
        chainID: chainID,
        grantee: address,
        granter: authzAddress,
      });
    } else {
      const msgs = getWithdrawValidatorCommisionAndRewardsMsgs({
        chainID,
        validator: validatorAddress,
      });
      const txInputs = txWithdrawCommissionAndRewardsInputs(chainID, msgs);
      dispatch(txWithdrawValidatorCommissionAndRewards(txInputs));
    }
  };

  return (
    <div>
      {isNotValidator || (isAuthzMode && !isAuthzValidator) ? (
        <StakingCardActionButton
          name={'Claim'}
          action={claim}
          isPending={
            txClaimStatus === TxStatus.PENDING &&
            validatorAddress === processingValAddr &&
            !isClaimAll
          }
          enable={enable}
        />
      ) : (isSelfValidator && !isAuthzMode) ||
        canAuthzClaimRewardsCommission ? (
        <button onClick={claimRewardsAndCommission}>Claim Commision</button>
      ) : (
        <button>!Claim Commision</button>
      )}
    </div>
  );
};

export default ClaimRewards;

const WithdrawCommission = () => {
  return <div></div>;
};
