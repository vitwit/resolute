import React from 'react';
import { StakingCardActionButton } from './StakingCard';
import { TxStatus } from '@/types/enums';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetWithdrawPermissions from '@/custom-hooks/useGetWithdrawPermissions';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetDistributionMsgs from '@/custom-hooks/useGetDistributionMsgs';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txWithdrawSingleValidatorCommissionAndRewards } from '@/store/features/distribution/distributionSlice';
import { CircularProgress, Tooltip } from '@mui/material';
import Image from 'next/image';
import { setError } from '@/store/features/common/commonSlice';

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
  const { txAuthzWithdrawValidatorRewardsAndCommission } =
    useAuthzStakingExecHelper();
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

  const isAuthzValidator =
    authzStakingData?.[chainID]?.validator?.validatorInfo?.operator_address ===
    validatorAddress
      ? true
      : false;

  const isSelfValidator =
    stakingData?.[chainID]?.validator?.validatorInfo?.operator_address ===
    validatorAddress
      ? true
      : false;

  const canAuthzClaimCommission =
    isAuthzValidator && isAuthzMode && withdrawCommissionAllowed;
  const canAuthzClaimRewardsCommission =
    canAuthzClaimCommission && withdrawRewardsAllowed;

  const isNotValidator = !isSelfValidator && !isAuthzValidator;

  const claimRewardsAndCommission = () => {
    if (isAuthzMode) {
      txAuthzWithdrawValidatorRewardsAndCommission({
        chainID: chainID,
        grantee: address,
        granter: authzAddress,
        validator: validatorAddress,
      });
    } else {
      const msgs = getWithdrawValidatorCommisionAndRewardsMsgs({
        chainID,
        validator: validatorAddress,
      });
      const txInputs = txWithdrawCommissionAndRewardsInputs(chainID, msgs);
      dispatch(txWithdrawSingleValidatorCommissionAndRewards(txInputs));
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
        <WithdrawCommission
          enable={enable}
          claimRewardsAndCommission={claimRewardsAndCommission}
          chainID={chainID}
        />
      ) : (
        <WithdrawCommission
          enable={enable}
          chainID={chainID}
          claimRewardsAndCommission={() => {
            dispatch(
              setError({
                type: 'error',
                message:
                  "You don't have permission to Withdraw Rewards & Commission",
              })
            );
          }}
        />
      )}
    </div>
  );
};

export default ClaimRewards;

const WithdrawCommission = ({
  enable,
  claimRewardsAndCommission,
  chainID,
}: {
  enable: boolean;
  claimRewardsAndCommission: () => void;
  chainID: string;
}) => {
  const txWithdrawSingleValCommission = useAppSelector(
    (state) => state.distribution.chains[chainID]?.txWithdrawSingleValCommission
  );

  const isPending = txWithdrawSingleValCommission.status === TxStatus.PENDING;

  return (
    <Tooltip title="Claim (Rewards & Commission)" placement="top">
      <button
        className={
          enable
            ? 'staking-card-action-button'
            : 'staking-card-action-button delegate-button-disabled'
        }
        onClick={claimRewardsAndCommission}
      >
        {isPending ? (
          <CircularProgress size={16} sx={{ color: 'white' }} />
        ) : (
          <div className="flex gap-1 items-center">
            <div>Claim</div>
            <Image src="/i-button.png" height={13} width={13} alt="" />
          </div>
        )}
      </button>
    </Tooltip>
  );
};
