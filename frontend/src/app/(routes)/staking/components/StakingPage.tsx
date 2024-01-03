'use client';

import React, { useEffect, useState } from 'react';
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
import {
  NO_DELEGATIONS_MSG,
  NO_MESSAGES_ILLUSTRATION,
} from '@/utils/constants';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import { TxStatus } from '@/types/enums';

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
  const [allValidatorsDialogOpen, setAllValidatorsDialogOpen] =
    useState<boolean>(false);
  const toggleValidatorsDialog = () => {
    setAllValidatorsDialogOpen((prevState) => !prevState);
  };
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
  const delegationsLoading = useAppSelector(
    (state: RootState) => state.staking.delegationsLoading
  );
  const txStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.tx
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

  useEffect(() => {
    if (txStatus?.status === TxStatus.IDLE) {
      setAllValidatorsDialogOpen(false);
    }
  }, [txStatus?.status]);

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
        {delegationsLoading === 0 && !hasDelegations ? (
          <div className="my-[5%] flex flex-col justify-center items-center">
            <Image
              src={NO_MESSAGES_ILLUSTRATION}
              width={200}
              height={177}
              alt={'No Transactions'}
              draggable={false}
            />
            <div className="text-[16px] opacity-50 mt-2 mb-6 leading-normal italic font-extralight text-center">
              {NO_DELEGATIONS_MSG}
            </div>
            <button
              onClick={toggleValidatorsDialog}
              className="primary-custom-btn mb-6"
            >
              Explore
            </button>
          </div>
        ) : null}

        {delegationsLoading !== 0 ? (
          <div className="no-data">
            <CircularProgress size={32} sx={{ color: 'white' }} />
          </div>
        ) : null}

        {hasUnbondings ? (
          <div className="mt-12">
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
        allValidatorsDialogOpen={allValidatorsDialogOpen}
        toggleValidatorsDialog={toggleValidatorsDialog}
      />
    </div>
  );
};

export default StakingPage;
