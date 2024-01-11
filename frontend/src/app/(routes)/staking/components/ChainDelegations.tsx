'use client';
import {
  ChainDelegationsProps,
  DelegateTxInputs,
  RedelegateTxInputs,
  UndelegateTxInputs,
  Validator,
} from '@/types/staking';
import React, { useEffect, useState } from 'react';
import StakingCard from './StakingCard';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
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
import { parseDenomAmount } from '@/utils/util';
import { TxStatus } from '@/types/enums';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';

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
}: ChainDelegationsProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { txAuthzDelegate, txAuthzReDelegate, txAuthzUnDelegate } =
    useAuthzStakingExecHelper();

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const networkLogo = networks[chainID]?.network.logos.menu;

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
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const [availableBalance, setAvailableBalance] = useState(0);
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [undelegateOpen, setUndelegateOpen] = useState(false);
  const [redelegateOpen, setRedelegateOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator>();
  const [processingValAddr, setProcessingValAddr] = useState<string>('');

  const handleCardClick = (valAddr: string) => {
    setProcessingValAddr(valAddr);
  };

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
  const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
  const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;
  const [allValidators, setAllValidators] = useState<Record<string, Validator>>(
    {}
  );

  const onDelegateTx = (data: DelegateTxInputs) => {
    const basicChainInfo = getChainInfo(chainID);
    if (isAuthzMode) {
      txAuthzDelegate({
        grantee: address,
        granter: authzAddress,
        validator: data.validator,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        chainID: basicChainInfo.chainID,
      });
      return;
    }
    dispatch(
      txDelegate({
        basicChainInfo: basicChainInfo,
        delegator: address,
        validator: data.validator,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        feeAmount: feeAmount,
        feegranter: '',
      })
    );
  };

  const onUndelegateTx = (data: UndelegateTxInputs) => {
    const basicChainInfo = getChainInfo(chainID);
    if (isAuthzMode) {
      txAuthzUnDelegate({
        grantee: address,
        granter: authzAddress,
        validator: data.validator,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        chainID: basicChainInfo.chainID,
      });
      return;
    }
    dispatch(
      txUnDelegate({
        basicChainInfo: getChainInfo(chainID),
        delegator: address,
        validator: data.validator,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        feeAmount: feeAmount,
        feegranter: '',
      })
    );
  };

  const onRedelegateTx = (data: RedelegateTxInputs) => {
    const basicChainInfo = getChainInfo(chainID);
    if (isAuthzMode) {
      txAuthzReDelegate({
        grantee: address,
        granter: authzAddress,
        srcValidator: data.src,
        validator: data.dest,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        chainID: basicChainInfo.chainID,
      });
      return;
    }
    dispatch(
      txReDelegate({
        basicChainInfo: getChainInfo(chainID),
        delegator: address,
        srcVal: data.src,
        destVal: data.dest,
        amount: data.amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        feeAmount: feeAmount,
        feegranter: '',
      })
    );
  };

  useEffect(() => {
    if (chainInfo.config.currencies?.length) {
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
    if (rewards?.length) {
      for (let i = 0; i < rewards.length; i++) {
        if (rewards[i].reward.length > 0) {
          const reward = rewards[i].reward;
          for (let j = 0; j < reward.length; j++) {
            if (reward[j].denom === currency.coinMinimalDenom) {
              const valReward = validatorRewards;
              valReward[rewards[i].validator_address] = parseDenomAmount(
                reward[j].amount,
                currency?.coinDecimals
              );
              setValidatorRewards((prevState) => ({
                ...prevState,
                ...valReward,
              }));
            }
          }
        } else {
          const valReward = validatorRewards;
          valReward[rewards[i].validator_address] = 0.0;
          setValidatorRewards((prevState) => ({ ...prevState, ...valReward }));
        }
      }
    }
  }, [rewards]);

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
    setAllValidators({ ...validators?.active, ...validators?.inactive });
  }, [validators]);

  useEffect(() => {
    if (txStatus?.status === TxStatus.IDLE) {
      handleDialogClose();
    }
  }, [txStatus?.status]);

  return (
    <>
      {delegations?.delegation_responses.map((row, index) => (
        <StakingCard
          processingValAddr={processingValAddr}
          handleCardClick={handleCardClick}
          key={row.delegation.validator_address}
          validator={
            allValidators[row.delegation.validator_address]?.description.moniker
          }
          identity={
            allValidators[row.delegation.validator_address]?.description
              .identity
          }
          chainName={chainName}
          commission={
            Number(
              allValidators[
                delegations?.delegation_responses[index]?.delegation
                  ?.validator_address
              ]?.commission?.commission_rates.rate
            ) * 100
          }
          delegated={parseDenomAmount(
            row?.delegation?.shares,
            currency?.coinDecimals
          )}
          rewards={validatorRewards?.[row.delegation.validator_address] || 0}
          networkLogo={networkLogo}
          coinDenom={currency.coinDenom}
          onMenuAction={onMenuAction}
          validatorInfo={allValidators[row.delegation.validator_address]}
          chainID={chainID}
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
        feeAmount={avgFeeAmount}
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
