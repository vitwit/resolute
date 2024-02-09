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
  claimCommission: () => void;
  isAuthzMode: boolean;
  withdrawCommissionAllowed: boolean;
}

interface IClaimButton {
  label: string;
  action: () => void;
  loading: TxStatus;
  styles: string;
}

const WithdrawActions: React.FC<IWithdrawActions> = (props) => {
  const {
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
  } = props;

  const canClaimCommission =
    isAuthzValidator && isAuthzMode && withdrawCommissionAllowed;
  const canClaimRewardsCommission =
    canClaimCommission && withdrawRewardsAllowed;
  const canOnlyClaimCommission = canClaimCommission && !withdrawRewardsAllowed;

  return (
    <div className="flex gap-6">
      <ClaimButton
        label="Withdraw Rewards"
        loading={withdrawRewardsLoading}
        action={claimRewards}
        styles="min-w-[224px]"
      />
      {(isSelfValidator && !isAuthzMode) || canClaimRewardsCommission ? (
        <ClaimButton
          label="Withdraw Rewards & Commission"
          action={claimRewardsAndCommission}
          loading={withdrawCommissionLoading}
          styles="min-w-[332px]"
        />
      ) : (
        <>
          {(isSelfValidator && !isAuthzMode) || canOnlyClaimCommission ? (
            <ClaimButton
              label="Withdraw Commission"
              action={claimCommission}
              loading={withdrawCommissionLoading}
              styles="min-w-[248px]"
            />
          ) : null}
        </>
      )}
    </div>
  );
};

const ClaimButton: React.FC<IClaimButton> = (props) => {
  const { label, action, loading, styles } = props;
  return (
    <button
      disabled={loading === TxStatus.PENDING}
      onClick={() => action()}
      className={'claim-button ' + styles}
    >
      {loading === TxStatus.PENDING ? (
        <CircularProgress sx={{ color: 'white' }} size={20} />
      ) : (
        label
      )}
    </button>
  );
};

export default WithdrawActions;
