import React, { useEffect, useState } from 'react';
import { StakingCardHeader } from './StakingCard';
import { formatCoin, getDaysLeftString } from '@/utils/util';
import { getDaysLeft } from '@/utils/datetime';
import { Dialog, DialogContent, Tooltip } from '@mui/material';
import {
  UnbondingCardProps,
  UnbondingCardStatsItemProps,
  UnbondingCardStatsProps,
} from '@/types/staking';
import { dialogBoxStyles } from '../styles';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  resetCancelUnbondingTx,
  txCancelUnbonding,
} from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';

const UnbondingCard = ({
  moniker,
  identity,
  chainName,
  amount,
  networkLogo,
  currency,
  completionTime,
  chainID,
  validatorAddress,
  creationHeight,
}: UnbondingCardProps) => {
  const dispatch = useAppDispatch();
  const [unbondingDialogOpen, setUnbondingDialogOpen] =
    useState<boolean>(false);
  const handleDialogClose = () => {
    setUnbondingDialogOpen(false);
  };
  const { getChainInfo } = useGetChainInfo();
  const { feeAmount: avgFeeAmount, address } = getChainInfo(chainID);
  const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

  const loading = useAppSelector(
    (state: RootState) => state.staking.chains[chainID].cancelUnbondingTxStatus
  );
  useEffect(() => {
    dispatch(resetCancelUnbondingTx({ chainID: chainID }));
  }, []);
  const onCancelUnbondingTx = () => {
    dispatch(
      txCancelUnbonding({
        basicChainInfo: getChainInfo(chainID),
        delegator: address,
        validator: validatorAddress,
        amount: amount * 10 ** currency.coinDecimals,
        denom: currency.coinMinimalDenom,
        feeAmount: feeAmount,
        feegranter: '',
        creationHeight: creationHeight,
      })
    );
  };
  return (
    <div className="unbonding-card">
      <StakingCardHeader
        validator={moniker}
        identity={identity}
        network={chainName}
        networkLogo={networkLogo}
      />
      <UnbondingCardStats
        completionTime={completionTime}
        amount={amount}
        coinDenom={currency.coinDenom}
      />
      <div>
        <Tooltip title="Cancel unbonding" placement="right">
          <button
            className="primary-gradient cancel-unbonding-btn"
            onClick={() => setUnbondingDialogOpen(true)}
          >
            Cancel
          </button>
        </Tooltip>
      </div>
      <DialogCancelUnbonding
        open={unbondingDialogOpen}
        onClose={handleDialogClose}
        onCancelUnbondingTx={onCancelUnbondingTx}
        loading={loading}
      />
    </div>
  );
};

export default UnbondingCard;

const UnbondingCardStats = ({
  completionTime,
  amount,
  coinDenom,
}: UnbondingCardStatsProps) => {
  const daysLeft = getDaysLeft(completionTime);
  return (
    <div className="flex justify-between">
      <UnbondingCardStatsItem
        name={'Available in'}
        value={getDaysLeftString(daysLeft)}
      />
      <UnbondingCardStatsItem
        name={'Amount'}
        value={formatCoin(amount, coinDenom)}
      />
    </div>
  );
};

export const UnbondingCardStatsItem = ({
  name,
  value,
}: UnbondingCardStatsItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="txt-sm font-extralight text-right opacity-50">{name}</div>
      <div className="txt-md font-bold">{value}</div>
    </div>
  );
};

interface DialogCancelUnbondingProps {
  open: boolean;
  onClose: () => void;
  onCancelUnbondingTx: () => void;
  loading: TxStatus;
}

const DialogCancelUnbonding: React.FC<DialogCancelUnbondingProps> = (props) => {
  const { open, onClose, onCancelUnbondingTx, loading } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={dialogBoxStyles}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] flex gap-16 pr-10 pl-6 items-center">
            <Image
              src="/blocks-image-2.png"
              height={238}
              width={288}
              alt="Delete Txn"
            />
            <div className="flex flex-col gap-10 w-full">
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold leading-normal">
                  Cancel Unbonding
                </h2>
                <div className="font-light text-[14px]">
                  Once this action is done, It cannot be undone.
                </div>
                <div className="mt-10 flex gap-10 items-center">
                  <button
                    type="submit"
                    className="primary-gradient rounded-2xl px-10 py-[10px]"
                    onClick={() => onCancelUnbondingTx()}
                    disabled={loading === TxStatus.PENDING}
                  >
                    {loading === TxStatus.PENDING ? 'Loading' : 'Continue'}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
