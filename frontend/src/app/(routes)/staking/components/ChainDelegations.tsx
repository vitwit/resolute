'use client';
import { GetDelegationsResponse, Validator, Validators } from '@/types/staking';
import React, { useEffect, useState } from 'react';
import StakingCard from './StakingCard';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { DelegatorRewards } from '@/types/distribution';
import { useRouter } from 'next/navigation';
import {
  txDelegate,
  txReDelegate,
  txUnDelegate,
} from '@/store/features/staking/stakeSlice';
import DialogDelegate from './DialogDelegate';
import { parseBalance } from '@/utils/denom';
import DialogUndelegate from './DialogUndelegate';
import DialogRedelegate from './DialogRedelegate';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const ChainDelegations = ({
  chainID,
  delegations,
  validators,
  currency,
  chainName,
  rewards,
  validatorAddress,
  action,
  chainSpecific,
}: {
  chainID: string;
  chainName: string;
  delegations: GetDelegationsResponse;
  validators: Validators;
  currency: Currency;
  rewards: DelegatorRewards[];
  validatorAddress: string;
  action: string;
  chainSpecific: boolean;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const networkLogo = networks[chainID].network.logos.menu;

  const [validatorRewards, setValidatorRewards] = React.useState<{
    [key: string]: number;
  }>({});

  const txStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.tx
  );
  const balance = useAppSelector(
    (state: RootState) => state.bank.balances[chainID]
  );
  const stakingParams = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.params
  );

  const [availableBalance, setAvailableBalance] = useState(0);
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [undelegateOpen, setUndelegateOpen] = useState(false);
  const [redelegateOpen, setRedelegateOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator>();

  const handleDialogClose = () => {
    if (chainSpecific) {
      router.push(`/staking/${chainName.toLowerCase()}`);
    }
    setDelegateOpen(false);
    setUndelegateOpen(false);
    setRedelegateOpen(false);
  };

  const onMenuAction = (type: string, validator: Validator) => {
    const valAddress = validator?.operator_address;

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
    if (chainSpecific) {
      router.push(`?validator_address=${valAddress}&action=${type}`);
    }
  };

  const allChainInfo = networks[chainID];
  const chainInfo = allChainInfo?.network;
  const address = allChainInfo?.walletInfo?.bech32Address;

  const { getChainInfo } = useGetChainInfo();

  const onDelegateTx = (data: { validator: string; amount: number }) => {
    dispatch(
      txDelegate({
        basicChainInfo: getChainInfo(chainID),
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

  const onUndelegateTx = (data: { validator: string; amount: number }) => {
    dispatch(
      txUnDelegate({
        basicChainInfo: getChainInfo(chainID),
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

  const onRedelegateTx = (data: {
    src: string;
    amount: number;
    dest: string;
  }) => {
    dispatch(
      txReDelegate({
        basicChainInfo: getChainInfo(chainID),
        delegator: address,
        srcVal: data.src,
        destVal: data.dest,
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

  useEffect(() => {
    if (rewards?.length > 0) {
      for (let i = 0; i < rewards.length; i++) {
        if (rewards[i].reward.length > 0) {
          const reward = rewards[i].reward;
          for (let j = 0; j < reward.length; j++) {
            if (reward[j].denom === currency.coinMinimalDenom) {
              const valReward = validatorRewards;
              valReward[rewards[i].validator_address] =
                parseFloat(reward[j].amount) / 10 ** currency?.coinDecimals;
              setValidatorRewards(valReward);
            }
          }
        } else {
          const valReward = validatorRewards;
          valReward[rewards[i].validator_address] = 0.0;
          setValidatorRewards(valReward);
        }
      }
    }
  }, [rewards]);

  return (
    <>
      {delegations?.delegation_responses.map((row, index) => (
        <StakingCard
          key={index}
          validator={
            validators?.active[row.delegation.validator_address]?.description
              .moniker
          }
          identity={
            validators?.active[row.delegation.validator_address]?.description
              .identity
          }
          chainName={chainName}
          commission={
            Number(
              validators?.active[
                delegations?.delegation_responses[0]?.delegation
                  ?.validator_address
              ]?.commission?.commission_rates.rate
            ) * 100
          }
          delegated={
            parseFloat(row?.delegation?.shares) / 10 ** currency?.coinDecimals
          }
          rewards={validatorRewards?.[row.delegation.validator_address] || 0}
          networkLogo={networkLogo}
          coinDenom={currency.coinDenom}
          onMenuAction={onMenuAction}
          validatorInfo={validators?.active[row.delegation.validator_address]}
        />
      ))}
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
      <DialogUndelegate
        onClose={handleDialogClose}
        open={undelegateOpen}
        validator={selectedValidator}
        stakingParams={stakingParams}
        onUndelegate={onUndelegateTx}
        loading={txStatus?.status}
        delegations={delegations?.delegation_responses}
        currency={currency}
      />
      <DialogRedelegate
        onClose={handleDialogClose}
        open={redelegateOpen}
        validator={selectedValidator}
        stakingParams={stakingParams}
        active={validators?.active}
        inactive={validators?.inactive}
        delegations={delegations?.delegation_responses}
        loading={txStatus?.status}
        onRedelegate={onRedelegateTx}
        currency={currency}
      />
    </>
  );
};

export default ChainDelegations;
