'use client';

import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import {
  createTxn,
  getMultisigBalance,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import TxnBuilder from '@/components/txn-builder/TxnBuilder';
import DialogVerifyAccount from '../../../components/common/DialogVerifyAccount';
import { fee } from '@/txns/execute';
import { getAuthToken } from '@/utils/localStorage';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { setError } from '@/store/features/common/commonSlice';
import { useRouter } from 'next/navigation';
import { parseBalance } from '@/utils/denom';

const PageTxnBuilder = ({
  paramChain,
  multisigAddress,
}: {
  paramChain: string;
  multisigAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainName = paramChain.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  const handleBackToMultisig = () => {
    router.push(`/multisig/${chainName}/${multisigAddress}`);
  };

  return (
    <div className="py-10 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 sticky top-0 space-y-2">
        <button
          type="button"
          className="secondary-btn h-8"
          onClick={handleBackToMultisig}
        >
          Back to multisig
        </button>
        <PageHeader
          title="New Multisig Transaction"
          description="Transaction builder allows to create single transaction with multiple
          messages of same or different type."
        />
      </div>
      {validChain ? (
        <>
          {isWalletConnected ? (
            <PageTxnBuilderEntry
              chainName={chainName}
              multisigAddress={multisigAddress}
              handleBackToMultisig={handleBackToMultisig}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyScreen
                title="Connect your wallet"
                description="Connect your wallet to access your account on Resolute"
                hasActionBtn={true}
                btnText={'Connect Wallet'}
                btnOnClick={connectWalletOpen}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full txt-lg">
            - The {chainName} is not supported -
          </div>
        </>
      )}
    </div>
  );
};

export default PageTxnBuilder;

const PageTxnBuilderEntry = ({
  chainName,
  multisigAddress,
  handleBackToMultisig,
}: {
  chainName: string;
  multisigAddress: string;
  handleBackToMultisig: () => void;
}) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs?.[chainName];
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { address, baseURL, restURLs } = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { isAccountVerified } = useVerifyAccount({ address });

  const [availableBalance, setAvailableBalance] = useState(0);

  const createRes = useAppSelector((state) => state.multisig.createTxnRes);
  const handleVerifyAccount = () => {
    dispatch(setVerifyDialogOpen(true));
  };

  useEffect(() => {
    if (!isAccountVerified()) {
      handleVerifyAccount();
    }
  }, []);

  const onSubmit = (data: TxnBuilderForm) => {
    const feeObj = fee(
      currency.coinMinimalDenom,
      data.fees.toString(),
      data.gas
    );
    const authToken = getAuthToken(COSMOS_CHAIN_ID);
    dispatch(
      createTxn({
        data: {
          address: multisigAddress,
          chain_id: chainID,
          messages: data.msgs,
          fee: feeObj,
          memo: data.memo,
          gas: data.gas,
        },
        queryParams: {
          address,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  useEffect(() => {
    if (createRes?.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: createRes?.error,
        })
      );
    } else if (createRes?.status === 'idle') {
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created',
        })
      );
      setTimeout(handleBackToMultisig, 1000);
    }
  }, [createRes]);

  const balance = useAppSelector((state) => state.multisig.balance.balance);
  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(
          [balance],
          currency.coinDecimals,
          currency.coinMinimalDenom
        )
      );
    }
  }, [balance]);

  useEffect(() => {
    if (chainID) {
      dispatch(
        getMultisigBalance({
          baseURL,
          address: multisigAddress,
          denom: currency.coinMinimalDenom,
          baseURLs: restURLs,
          chainID,
        })
      );
    }
  }, []);

  return (
    <>
      {isAccountVerified() ? (
        <TxnBuilder
          chainID={chainID}
          onSubmit={onSubmit}
          loading={createRes.status === 'pending'}
          availableBalance={availableBalance}
          fromAddress={multisigAddress}
        />
      ) : (
        <EmptyScreen
          title="Verify Ownership"
          description="Verify your account ownership to proceed"
          btnOnClick={handleVerifyAccount}
          btnText="Verify Ownership"
          hasActionBtn={true}
        />
      )}
      <DialogVerifyAccount walletAddress={address} />
    </>
  );
};
