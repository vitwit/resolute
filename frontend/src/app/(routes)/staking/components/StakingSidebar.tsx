'use client';

import { StakingSidebarProps } from '@/types/staking';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import StakingStatsCard from './StakingStatsCard';
import TopNav from '@/components/TopNav';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import { TxStatus } from '@/types/enums';
import { txRestake } from '@/store/features/staking/stakeSlice';
import { setError } from '@/store/features/common/commonSlice';
import AllValidators from './AllValidators';
import { formatStakedAmount } from '@/utils/util';
import {
  NO_DELEGATIONS_ERROR,
  NO_REWARDS_ERROR,
  TXN_PENDING_ERROR,
} from '@/utils/errors';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { DelegationsPairs } from '@/types/distribution';

const StakingSidebar = ({
  validators,
  currency,
  chainID,
  onMenuAction,
  allValidatorsDialogOpen,
  toggleValidatorsDialog,
}: StakingSidebarProps) => {
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const staked = useAppSelector((state) => state.staking.chains);
  const authzStaked = useAppSelector((state) => state.staking.authz.chains);
  const rewards = useAppSelector((state) => state.distribution.chains);
  const authzRewards = useAppSelector(
    (state) => state.distribution.authzChains
  );

  const { txAuthzClaim, txAuthzRestake } = useAuthzStakingExecHelper();
  const stakedBalance = isAuthzMode
    ? authzStaked[chainID]?.delegations.totalStaked || 0
    : staked[chainID]?.delegations.totalStaked || 0;

  const totalRewards = isAuthzMode
    ? authzRewards[chainID]?.delegatorRewards.totalRewards || 0
    : rewards[chainID]?.delegatorRewards.totalRewards || 0;

  const isClaimAll = useAppSelector(
    (state) => state?.distribution?.chains?.[chainID]?.isTxAll || false
  );
  const isReStakeAll = useAppSelector(
    (state) => state?.staking?.chains?.[chainID]?.isTxAll || false
  );
  const tokens = [
    {
      amount: stakedBalance.toString(),
      denom: currency.coinMinimalDenom,
    },
  ];
  const rewardTokens = [
    {
      amount: parseInt(totalRewards.toString()).toString(),
      denom: currency.coinMinimalDenom,
    },
  ];

  const txClaimStatus = useAppSelector(
    (state: RootState) => state.distribution.chains[chainID]?.tx.status
  );
  const txAuthzStatus = useAppSelector(
    (state) => state.authz.chains[chainID]?.tx?.status || TxStatus.INIT
  );
  const txRestakeStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.reStakeTxStatus
  );
  const validatorsStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators.status
  );
  const delegations = isAuthzMode
    ? authzStaked[chainID]?.delegations?.delegations?.delegation_responses
    : staked[chainID]?.delegations?.delegations?.delegation_responses;

  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { txWithdrawAllRewardsInputs, txRestakeInputs, txAuthzRestakeMsgs } =
    useGetTxInputs();

  const claim = (chainID: string) => {
    if (isAuthzMode) {
      if (txAuthzStatus === TxStatus.PENDING) {
        dispatch(
          setError({
            type: 'error',
            message: TXN_PENDING_ERROR('Authz'),
          })
        );
        return;
      }
      const { address } = getChainInfo(chainID);
      const pairs: DelegationsPairs[] = (
        authzRewards[chainID]?.delegatorRewards?.list || []
      ).map((reward) => {
        const pair = {
          delegator: authzAddress,
          validator: reward.validator_address,
        };
        return pair;
      });
      txAuthzClaim({
        grantee: address,
        granter: authzAddress,
        pairs: pairs,
        chainID: chainID,
      });
      return;
    }

    if (txClaimStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Claim'),
        })
      );
      return;
    }
    const txInputs = txWithdrawAllRewardsInputs(chainID);
    txInputs.isTxAll = true;
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_DELEGATIONS_ERROR,
        })
      );
    }
  };

  const claimAndStake = (chainID: string) => {
    if (txRestakeStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Restake'),
        })
      );
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    txInputs.isTxAll = true;
    if (isAuthzMode) {
      const { address } = getChainInfo(chainID);
      const msgs = txAuthzRestakeMsgs(chainID);
      txAuthzRestake({
        grantee: address,
        granter: authzAddress,
        msgs: msgs,
        chainID: chainID,
      });
      return;
    }
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_REWARDS_ERROR,
        })
      );
    }
  };

  return (
    <div className="staking-sidebar flex flex-col">
      <div className="flex flex-col gap-10">
        <TopNav />
        <div className="flex gap-6">
          <StakingStatsCard
            name={'Staked Balance'}
            value={formatStakedAmount(tokens, currency)}
          />
          <StakingStatsCard
            name={'Rewards'}
            value={formatStakedAmount(rewardTokens, currency)}
          />
        </div>
        {delegations?.length > 1 ? (
          <div className="staking-sidebar-actions">
            <button
              className="staking-sidebar-actions-btn"
              onClick={() => claim(chainID)}
            >
              {txClaimStatus === TxStatus.PENDING && isClaimAll ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : (
                'Claim All'
              )}
            </button>
            <button
              className="staking-sidebar-actions-btn"
              onClick={() => claimAndStake(chainID)}
            >
              {txRestakeStatus === TxStatus.PENDING && isReStakeAll ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : (
                'Restake All'
              )}
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-20 overflow-y-scroll">
        <AllValidators
          validators={validators}
          currency={currency}
          onMenuAction={onMenuAction}
          validatorsStatus={validatorsStatus}
          allValidatorsDialogOpen={allValidatorsDialogOpen}
          toggleValidatorsDialog={toggleValidatorsDialog}
        />
      </div>
    </div>
  );
};

export default StakingSidebar;
