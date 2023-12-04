'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import { RootState } from '@/store/store';
import './style.css';

import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txDeposit } from '@/store/features/gov/govSlice';

const DepositPopup = ({
  chainID,
  votingEndsInDays,
  denom,
  proposalId,
  proposalname,
}: {
  chainID: string;
  votingEndsInDays: string;
  denom?: string;
  proposalId: number;
  proposalname: string;
}) => {
  console.log(denom);
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const allChainInfo = networks[chainID];
  console.log(chainID);

  const { getVoteTxInputs } = useGetTxInputs();
  const dispatch = useAppDispatch();

  // const chainInfo = allChainInfo.network;
  // const address = allChainInfo?.walletInfo?.bech32Address;
  const minimalDenom =
    allChainInfo.network.config.stakeCurrency.coinMinimalDenom;

  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  const handleDeposit = () => {
    const { aminoConfig, prefix, rest, feeAmount, address, rpc, minimalDenom } =
      getVoteTxInputs(chainID);

    dispatch(
      txDeposit({
        depositer: address,
        proposalId: proposalId,
        amount: amount,
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
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: { borderRadius: '16px', backgroundColor: '#20172F' } }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="popup-grid">
          <div className="cross" onClick={handleClose}>
            <Image
              src="./plainclose-icon.svg"
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
                        src="./cosmos-logo.svg"
                        width={40}
                        height={40}
                        alt="Cosmos-Logo"
                      />
                      <p className="proposal-text-small">
                        {proposalId} | Proposal
                      </p>
                    </div>
                    <div className="proposal-text-normal">{proposalname}</div>
                    <div className="proposal-text-small">{`Voting ends in ${votingEndsInDays} days`}</div>
                  </div>
                </div>

                <div className="placeholder-text ">
                  <div className="flex w-full justify-between">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      placeholder="Enter Amount Here"
                    />
                    <div className="proposal-text-extralight flex items-center">
                      {minimalDenom}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleDeposit}
                    disabled={!amount || amount < 0}
                    className="button w-36"
                  >
                    <p className="proposal-text-medium">Deposit</p>
                  </button>
                </div>
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
