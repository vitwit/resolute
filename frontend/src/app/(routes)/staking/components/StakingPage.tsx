'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getParams,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';

import ChainDelegations from './ChainDelegations';
import StakingSidebar from './StakingSidebar';
import ChainUnbondings from './ChainUnbondings';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { Validator } from '@/types/staking';
import { useRouter } from 'next/navigation';
import { getBalances } from '@/store/features/bank/bankSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const StakingPage = ({
  chainName,
  validatorAddress,
  action,
}: {
  chainName: string;
  validatorAddress: string;
  action: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.delegations.delegations
  );
  const unbondingDelegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.unbonding.unbonding
  );
  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID]?.network?.config?.currencies[0]
  );
  const rewards = useAppSelector(
    (state: RootState) =>
      state.distribution.chains?.[chainID]?.delegatorRewards.list
  );
  const hasUnbondings = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.unbonding?.hasUnbonding
  );
  const hasDelegations = useAppSelector(
    (state: RootState) =>
      state.staking.chains[chainID]?.delegations?.hasDelegations
  );

  const { getChainInfo } = useGetChainInfo();
  const { address, baseURL } = getChainInfo(chainID);

  useEffect(() => {
    dispatch(
      getDelegations({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(
      getAllValidators({
        baseURL,
        chainID,
      })
    );
    dispatch(
      getUnbonding({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(
      getDelegatorTotalRewards({
        baseURL,
        address,
        chainID,
        denom: currency.coinMinimalDenom,
      })
    );
    dispatch(
      getBalances({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(getParams({ baseURL, chainID }));
  }, [chainID]);

  const onMenuAction = (type: string, validator: Validator) => {
    const valAddress = validator?.operator_address;
    if (valAddress?.length) {
      router.push(`?validator_address=${valAddress}&action=${type}`);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="staking-main">
        <h2 className="txt-lg font-medium mb-6">Staking</h2>
        <div className="overview-grid">
          <ChainDelegations
            chainID={chainID}
            chainName={chainName}
            delegations={delegations}
            validators={validators}
            currency={currency}
            rewards={rewards}
            validatorAddress={validatorAddress}
            action={action}
            chainSpecific={true}
          />
        </div>
        {!hasDelegations ? (
          <div className="no-delegations">- No Delegations -</div>
        ) : null}

        {hasUnbondings ? (
          <div>
            <h2 className="txt-lg font-medium my-6">Unbonding</h2>
            <div className="unbondings-grid">
              <ChainUnbondings
                chainID={chainID}
                chainName={chainName}
                unbondings={unbondingDelegations}
                validators={validators}
                currency={currency}
              />
            </div>
          </div>
        ) : null}
      </div>
      <StakingSidebar
        chainID={chainID}
        validators={validators}
        currency={currency}
        onMenuAction={onMenuAction}
      />
    </div>
  );
};

export default StakingPage;
