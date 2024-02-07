import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import React from 'react';

const WithdrawActions = ({
  claimRewards,
  claimRewardsAndCommission,
  claimCommission,
  isAuthzValidator,
  isSelfValidator,
  withdrawCommissionLoading,
  withdrawRewardsAllowed,
  withdrawRewardsLoading,
  isAuthzMode,
  withdrawCommissionAllowed,
}: {
  withdrawRewardsAllowed: boolean;
  withdrawCommissionLoading: TxStatus;
  withdrawRewardsLoading: TxStatus;
  isSelfValidator: boolean;
  isAuthzValidator: boolean;
  claimRewards: () => void;
  claimRewardsAndCommission: () => void;
  claimCommission: () => void;
  isAuthzMode: boolean;
  withdrawCommissionAllowed: boolean;
}) => {
  const canClaimCommission =
    isAuthzValidator && isAuthzMode && withdrawCommissionAllowed;

  const canClaimRewardsCommission =
    canClaimCommission && withdrawRewardsAllowed;

  const canOnlyClaimCommission = canClaimCommission && !withdrawRewardsAllowed;

  return (
    <div className="flex gap-6">
      <ClaimRewardsButton
        loading={withdrawRewardsLoading}
        claimRewards={claimRewards}
      />
      {(isSelfValidator && !isAuthzMode) || canClaimRewardsCommission ? (
        <ClaimRewardsAndCommissionButton
          action={claimRewardsAndCommission}
          loading={withdrawCommissionLoading}
        />
      ) : (
        <>
          {(isSelfValidator && !isAuthzMode) || canOnlyClaimCommission ? (
            <ClaimCommissionButton
              action={claimCommission}
              loading={withdrawCommissionLoading}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

const ClaimRewardsButton = ({
  claimRewards,
  loading,
}: {
  loading: TxStatus;
  claimRewards: () => void;
}) => {
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => claimRewards()}
      className="claim-button"
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={20} />
      ) : (
        'Withdraw Rewards'
      )}
    </button>
  );
};

const ClaimRewardsAndCommissionButton = ({
  action,
  loading,
}: {
  loading: TxStatus;
  action: () => void;
}) => {
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => action()}
      className="claim-button"
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={20} />
      ) : (
        'Withdraw Rewards & Commission'
      )}
    </button>
  );
};

const ClaimCommissionButton = ({
  action,
  loading,
}: {
  loading: TxStatus;
  action: () => void;
}) => {
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => action()}
      className="claim-button"
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={20} />
      ) : (
        'Withdraw Commission'
      )}
    </button>
  );
};

export default WithdrawActions;
