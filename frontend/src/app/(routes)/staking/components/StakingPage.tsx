'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getParams,
  getUnbonding,
  txDelegate,
} from '@/store/features/staking/stakeSlice';

import ChainDelegations from './ChainDelegations';
import StakingSidebar from './StakingSidebar';
import ChainUnbondings from './ChainUnbondings';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { Validator } from '@/types/staking';
import DialogDelegate from './DialogDelegate';
import DialogUndelegate from './DialogUndelegate';
import DialogRedelegate from './DialogRedelegate';
import { useRouter } from 'next/navigation';
import { getBalances } from '@/store/features/bank/bankSlice';
import { parseBalance } from '@/utils/denom';

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
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
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
      state.wallet.networks[chainID].network?.config?.currencies[0]
  );
  const rewards = useAppSelector(
    (state: RootState) =>
      state.distribution.chains?.[chainID]?.delegatorRewards.list
  );
  const stakingParams = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.params
  );
  const balance = useAppSelector(
    (state: RootState) => state.bank.balances[chainID]
  );
  const txStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.tx
  );

  const allChainInfo = networks[chainID];
  const chainInfo = allChainInfo?.network;
  const address = allChainInfo?.walletInfo?.bech32Address;
  const baseURL = chainInfo?.config?.rest;

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

  const [availableBalance, setAvailableBalance] = useState(0);
  useEffect(() => {
    if (chainInfo.config.currencies.length > 0) {
      setAvailableBalance(
        parseBalance(
          balance?.list?.length ? balance.list : [],
          currency.coinDecimals,
          currency.coinMinimalDenom
        )
      );
    }
  }, [balance]);

  const [delegateOpen, setDelegateOpen] = useState(false);
  const [undelegateOpen, setUndelegateOpen] = useState(false);
  const [redelegateOpen, setRedelegateOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator>();

  const handleDialogClose = () => {
    router.push('/staking/passage');
    setDelegateOpen(false);
    setUndelegateOpen(false);
    setRedelegateOpen(false);
  };

  const onMenuAction = (type: string, validator: Validator) => {
    const valAddress = validator.operator_address;

    setSelectedValidator(validator);

    switch (type) {
      case 'delegate':
        setDelegateOpen(true);
        break;
      case 'undelegate':
        setUndelegateOpen(true);
        break;
      case 'redelegate':
        setRedelegateOpen(true);
        break;
      default:
        console.log('unsupported type');
    }
    router.push(`?validator_address=${valAddress}&action=${type}`);
  };

  const onDelegateTx = (data: { validator: string; amount: number }) => {
    dispatch(
      txDelegate({
        basicChainInfo: {
          baseURL: baseURL,
          chainID: chainID,
          aminoConfig: chainInfo.aminoConfig,
          rest: chainInfo.config.rest,
          rpc: chainInfo.config.rpc,
        },
        delegator: address,
        validator: data.validator,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          (chainInfo?.config?.feeCurrencies?.[0]?.gasPriceStep?.average || 0) *
          10 ** currency?.coinDecimals,
        feegranter: '',
      })
    );
  };

  useEffect(() => {
    if (validatorAddress.length && action.length && validators?.active) {
      const validatorInfo =
        validators.active[validatorAddress] ||
        validators.inactive[validatorAddress] ||
        {};
      const validatorExist = Object.keys(validatorInfo).length ? true : false;
      setSelectedValidator(validatorInfo);
      if (action === 'delegate' && validatorExist) {
        setDelegateOpen(true);
      } else if (action === 'undelegate' && validatorExist) {
        setUndelegateOpen(true);
      } else if (action === 'redelegate' && validatorExist) {
        setRedelegateOpen(true);
      }
    }
  }, [validatorAddress, action, validators]);

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
            onMenuAction={onMenuAction}
          />
        </div>

        <div>
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="overview-grid">
            <ChainUnbondings
              chainID={chainID}
              chainName={chainName}
              unbondings={unbondingDelegations}
              validators={validators}
              currency={currency}
            />
          </div>
        </div>
      </div>
      <StakingSidebar
        chainID={chainID}
        validators={validators}
        currency={currency}
        onMenuAction={onMenuAction}
      />
      <DialogDelegate
        onClose={handleDialogClose}
        open={delegateOpen}
        validator={selectedValidator}
        stakingParams={stakingParams}
        availableBalance={availableBalance}
        loading={txStatus?.status}
        displayDenom={currency.coinDenom}
        onDelegate={onDelegateTx}
      />
      <DialogUndelegate onClose={handleDialogClose} open={undelegateOpen} />
      <DialogRedelegate onClose={handleDialogClose} open={redelegateOpen} />
    </div>
  );
};

export default StakingPage;
