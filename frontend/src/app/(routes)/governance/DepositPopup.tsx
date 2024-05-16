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
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';

const DepositPopup = ({
  chainID,
  votingEndsInDays,
  proposalId,
  proposalname,
  open,
  onClose,
  networkLogo,
}: {
  chainID: string;
  votingEndsInDays: string;
  proposalId: number;
  proposalname: string;
  open: boolean;
  onClose: () => void;
  networkLogo: string;
}) => {
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

  const { getFeegranter } = useGetFeegranter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: '',
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleDeposit = (data: { amount: string }) => {
    const {
      aminoConfig,
      prefix,
      rest,
      feeAmount,
      address,
      rpc,
      minimalDenom,
      basicChainInfo,
    } = getVoteTxInputs(chainID);

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        granter: authzGranter,
        chainID: chainID,
        memo: '',
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
        memo: '',
      });
      return;
    }

    dispatch(
      txDeposit({
        isAuthzMode: false,
        basicChainInfo,
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
        feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['deposit']),
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
                        <p className="proposal-text-small">#{proposalId}</p>
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
                      rules={{
                        validate: (value) => {
                          const amount = Number(value);
                          if (isNaN(amount) || amount <= 0)
                            return 'Invalid Amount';
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          className="bg-[#FFFFFF0D] rounded-2xl"
                          {...field}
                          required
                          fullWidth
                          size="small"
                          autoFocus={true}
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
                        />
                      )}
                    />
                    <div className="error-box">
                      <span
                        className={
                          !!errors.amount
                            ? 'error-chip opacity-80'
                            : 'error-chip opacity-0'
                        }
                      >
                        {errors.amount?.message}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      className="deposit-popup-btn proposal-text-medium"
                      disabled={
                        loading === TxStatus.PENDING ||
                        (isAuthzMode && authzLoading === TxStatus.PENDING)
                      }
                    >
                      {loading === TxStatus.PENDING ||
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
