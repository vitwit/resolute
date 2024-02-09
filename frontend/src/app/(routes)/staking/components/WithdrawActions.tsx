import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import React from 'react';

interface IWithdrawActions {
  withdrawRewardsAllowed: boolean;
  withdrawCommissionLoading: TxStatus;
  withdrawRewardsLoading: TxStatus;
  isSelfValidator: boolean;
  isAuthzValidator: boolean;
  claimRewards: () => void;
  claimRewardsAndCommission: () => void;
  isAuthzMode: boolean;
  withdrawCommissionAllowed: boolean;
}

interface IClaimButton {
  action: () => void;
  loading: TxStatus;
}

const WithdrawActions: React.FC<IWithdrawActions> = (props) => {
  const {
    claimRewards,
    claimRewardsAndCommission,
    isAuthzValidator,
    isSelfValidator,
    withdrawCommissionLoading,
    withdrawRewardsAllowed,
    withdrawRewardsLoading,
    isAuthzMode,
    withdrawCommissionAllowed,
  } = props;

  const canAuthzClaimCommission =
    isAuthzValidator && isAuthzMode && withdrawCommissionAllowed;
  const canAuthzClaimRewardsCommission =
    canAuthzClaimCommission && withdrawRewardsAllowed;

  const isNotValidator = !isSelfValidator && !isAuthzValidator;

  const dispatch = useAppDispatch();

  return (
    <>
      {isNotValidator || (isAuthzMode && !isAuthzValidator) ? (
        <ClaimButton loading={withdrawRewardsLoading} action={claimRewards} />
      ) : (isSelfValidator && !isAuthzMode) ||
        canAuthzClaimRewardsCommission ? (
        <ValidatorClaimButton
          action={claimRewardsAndCommission}
          loading={withdrawCommissionLoading}
        />
      ) : (
        <ValidatorClaimButton
          action={() => {
            dispatch(
              setError({
                type: 'error',
                message:
                  "You don't have permission to Withdraw Rewards & Commission",
              })
            );
          }}
          loading={withdrawCommissionLoading}
        />
      )}
    </>
  );
};

const ClaimButton: React.FC<IClaimButton> = (props) => {
  const { action, loading } = props;
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => action()}
      className="staking-sidebar-actions-btn"
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={16} />
      ) : (
        'Claim All'
      )}
    </button>
  );
};

const ValidatorClaimButton: React.FC<IClaimButton> = (props) => {
  const { action, loading } = props;
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => action()}
      className="staking-sidebar-actions-btn h-[64px]"
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={16} />
      ) : (
        <div>
          <div>Claim All</div>
          <div className="text-[10px]">(Rewards & Commission)</div>
        </div>
      )}
    </button>
  );
};

export default WithdrawActions;
