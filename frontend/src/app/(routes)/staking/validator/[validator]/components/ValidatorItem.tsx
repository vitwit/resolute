import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  getTotalDelegationsCount,
  txDelegate,
} from '@/store/features/staking/stakeSlice';
import { DelegateTxInputs, ValidatorProfileInfo } from '@/types/staking';
import { formatCommission, formatValidatorStatsValue } from '@/utils/util';
import React, { useEffect, useState } from 'react';
import NetworkItem from './NetworkItem';
import DialogDelegate from '../../../components/DialogDelegate';
import { parseBalance } from '@/utils/denom';
import { TxStatus } from '@/types/enums';

const ValidatorItem = ({
  validatorInfo,
}: {
  validatorInfo: ValidatorProfileInfo;
}) => {
  const {
    chainID,
    commission,
    rank,
    totalStakedInUSD,
    tokens,
    operatorAddress,
  } = validatorInfo;
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const {
    chainName,
    chainLogo,
    restURLs,
    feeAmount: avgFeeAmount,
  } = getChainInfo(chainID);
  const dispatch = useAppDispatch();

  const totalDelegators = useAppSelector(
    (state) =>
      state.staking.chains[chainID].validatorProfiles?.[operatorAddress]
        ?.totalDelegators
  );
  const votingPower = formatValidatorStatsValue(tokens, 0);
  const totalStaked = formatValidatorStatsValue(totalStakedInUSD, 0);
  const totalDelegatorsCount = formatValidatorStatsValue(totalDelegators, 0);

  const { decimals, minimalDenom, displayDenom } = getDenomInfo(chainID);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const stakingParams = useAppSelector(
    (state) => state.staking.chains[chainID]?.params
  );
  const balance = useAppSelector((state) => state.bank.balances[chainID]);
  const txStatus = useAppSelector((state) => state.staking.chains[chainID]?.tx);
  const feeAmount = avgFeeAmount * 10 ** decimals;

  const onDelegateTx = (data: DelegateTxInputs) => {
    const basicChainInfo = getChainInfo(chainID);
    dispatch(
      txDelegate({
        isAuthzMode: false,
        basicChainInfo: basicChainInfo,
        delegator: basicChainInfo.address,
        validator: data.validator,
        amount: data.amount * 10 ** decimals,
        denom: minimalDenom,
        feeAmount: feeAmount,
        feegranter: '',
      })
    );
  };

  useEffect(() => {
    if (operatorAddress?.length) {
      dispatch(
        getTotalDelegationsCount({
          baseURLs: restURLs,
          chainID,
          operatorAddress,
        })
      );
    }
  }, [operatorAddress]);

  useEffect(() => {
    setAvailableBalance(
      parseBalance(
        balance?.list?.length ? balance.list : [],
        decimals,
        minimalDenom
      )
    );
  }, [balance]);

  useEffect(() => {
    if (txStatus?.status === TxStatus.IDLE) {
      handleDialogClose();
    }
  }, [txStatus?.status]);

  return (
    <tr>
      <td>
        <NetworkItem
          logo={chainLogo}
          networkName={chainName}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{rank}</td>
      <td>{votingPower}</td>
      <td>{totalDelegatorsCount !== '0' ? totalDelegatorsCount : '-'}</td>
      <td>{formatCommission(commission)}</td>
      <td>{'$ ' + totalStaked}</td>
      <td>
        <button
          onClick={() => setDialogOpen(true)}
          className="primary-gradient px-3 py-[6px] w-full rounded-lg"
        >
          Stake
        </button>
      </td>
      <DialogDelegate
        onClose={handleDialogClose}
        open={dialogOpen}
        validator={validatorInfo?.validatorInfo}
        stakingParams={stakingParams}
        availableBalance={availableBalance}
        loading={txStatus?.status}
        displayDenom={displayDenom}
        onDelegate={onDelegateTx}
        feeAmount={avgFeeAmount}
      />
    </tr>
  );
};

export default ValidatorItem;
