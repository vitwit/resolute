'use client';
import React from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import { RootState } from '@/store/store';
import './style.css';

import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txDeposit } from '@/store/features/gov/govSlice';
import { Controller, useForm } from 'react-hook-form';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { TxStatus } from '@/types/enums';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';

const DepositPopup = ({
  chainID,
  votingEndsInDays,
  denom,
  proposalId,
  proposalname,
  open,
  onClose,
  networkLogo,
}: {
  chainID: string;
  votingEndsInDays: string;
  denom?: string;
  proposalId: number;
  proposalname: string;
  open: boolean;
  onClose: () => void;
  networkLogo: string;
}) => {
  console.log(denom);
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const allChainInfo = networks[chainID];

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzGranter = useAppSelector((state) => state.authz.authzAddress);

  const { getVoteTxInputs } = useGetTxInputs();
  const { txAuthzDeposit } = useAuthzExecHelper();
  const dispatch = useAppDispatch();

  const currency = allChainInfo.network.config.currencies[0];
  const loading = useAppSelector(
    (state: RootState) => state.gov.chains?.[chainID]?.tx?.status
  );
  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[chainID]?.tx?.status || TxStatus.INIT
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleDeposit = (data: { amount: number }) => {
    const { aminoConfig, prefix, rest, feeAmount, address, rpc, minimalDenom } =
      getVoteTxInputs(chainID);

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        granter: authzGranter,
        chainID: chainID,
        metaData: '',
      });
      return;
    }

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        granter: authzGranter,
        chainID: chainID,
        metaData: '',
      });
      return;
    }

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        granter: authzGranter,
        chainID: chainID,
        metaData: '',
      });
      return;
    }

    dispatch(
      txDeposit({
        depositer: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        denom: minimalDenom,
        chainID: chainID,
        rpc: rpc,
        rest: rest,
        aminoConfig: aminoConfig,
        prefix: prefix,
        feeAmount: feeAmount,
        feegranter: '',
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: dialogBoxPaperPropStyles }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="popup-grid">
          <div className="cross" onClick={handleClose}>
            <Image
              src="/plainclose-icon.svg"
              width={24}
              height={24}
              className="cursor-pointer"
              alt="Close"
            />
          </div>
          <div className="image-grid">
            <div className="flex">
              <Image
                src="/deposit.png"
                width={335}
                height={298}
                alt="Deposit-Image"
                className="disable-draggable"
              />
            </div>
            <div className="text-grid">
              <div className="space-y-4">
                <div className="proposal-text-big font-bold">Deposit</div>
                <div className="text-form">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-x-2 flex">
                        <Image
                          className="rounded-full"
                          src={networkLogo}
                          width={26}
                          height={26}
                          alt="logo"
                        />
                        <p className="proposal-text-small">{proposalId}</p>
                      </div>
                      <div className="proposal-text-small">{`Deposit period ends in ${votingEndsInDays} `}</div>
                    </div>
                    <div className="proposal-text-normal-base">
                      {proposalname}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(handleDeposit)}>
                  <div className="space-y-2">
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          className="bg-[#FFFFFF0D] rounded-2xl"
                          {...field}
                          required
                          fullWidth
                          size="small"
                          placeholder="Enter Amount here"
                          sx={{
                            '& .MuiTypography-body1': {
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 200,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                {currency?.coinDenom}
                              </InputAdornment>
                            ),
                            sx: {
                              input: {
                                color: 'white',
                                fontSize: '14px',
                                padding: 2,
                              },
                            },
                          }}
                          error={!!errors.amount}
                          helperText={
                            errors.amount?.type === 'validate'
                              ? 'Insufficient balance'
                              : errors.amount?.message
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="mt-6">
                    <button
                      className="deposit-popup-btn proposal-text-medium"
                      disabled={
                        (!isAuthzMode && loading === TxStatus.PENDING) ||
                        (isAuthzMode && authzLoading === TxStatus.PENDING)
                      }
                    >
                      {(!isAuthzMode && loading === TxStatus.PENDING) ||
                      (isAuthzMode && authzLoading === TxStatus.PENDING) ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Deposit'
                      )}{' '}
                    </button>
                  </div>
                </form>
              </div>
              <div className="cross"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositPopup;
