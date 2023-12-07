'use client';
import React, { useState } from 'react';
import {
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
  console.log(chainID);

  const { getVoteTxInputs } = useGetTxInputs();
  const dispatch = useAppDispatch();

  const currency = allChainInfo.network.config.currencies[0];

  const [amount, setAmount] = useState(0);

  const {
    handleSubmit,
    control,
    setValue,
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
    console.log(data);

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
      PaperProps={{ sx: { borderRadius: '16px', backgroundColor: '#20172F' } }}
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
              />
            </div>
            <div className="text-grid">
              <div className="space-y-6">
                <div className="proposal-text-big">Deposit</div>
                <div className="text-form">
                  <div className="space-y-2">
                    <div className="space-x-2 flex">
                      <Image
                        src={networkLogo}
                        width={40}
                        height={40}
                        alt="logo"
                      />
                      <p className="proposal-text-small">
                        {proposalId} | Proposal
                      </p>
                    </div>
                    <div className="proposal-text-normal">{proposalname}</div>
                    <div className="proposal-text-small">{`Deposit period ends in ${votingEndsInDays} days`}</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(handleDeposit)}>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{
                      required: 'Amount is required',
                    }}
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
                  <div className="mt-6">
                    <button
                      disabled={isNaN(amount) || amount < 0}
                      className="button w-36"
                    >
                      <p className="proposal-text-medium">Deposit</p>
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
