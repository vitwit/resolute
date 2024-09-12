'use client';

import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import TxnBuilder from '@/components/txn-builder/TxnBuilder';
import { TxStatus } from '@/types/enums';
import { txExecuteMultiMsg } from '@/store/features/multiops/multiopsSlice';
import { parseBalance } from '@/utils/denom';
import { getBalances } from '@/store/features/bank/bankSlice';
import { TXN_BUILDER_DESCRIPTION } from '@/utils/constants';

const PageMultiops = ({ paramChain }: { paramChain: string }) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainName = paramChain.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const showAuthzAlert = useAppSelector((state) => state.authz.authzAlert.display);
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className={`py-10 flex flex-col ${showAuthzAlert ? "h-[calc(100vh-118px)]":"h-[calc(100vh-64px)]"}`}>
      <div className="flex-1 sticky top-0">
        <PageHeader
          title="Transaction Builder"
          description={TXN_BUILDER_DESCRIPTION}
        />
      </div>
      {validChain ? (
        <>
          {isWalletConnected ? (
            <PageMultiopsEntry chainName={chainName} />
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
          <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
            - The {chainName} is not supported -
          </div>
        </>
      )}
    </div>
  );
};

export default PageMultiops;

const PageMultiopsEntry = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs?.[chainName];
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const {
    address,
    prefix,
    rest,
    rpc,
    baseURL,
    restURLs: baseURLs,
  } = basicChainInfo;
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };

  const [availableBalance, setAvailableBalance] = useState(0);

  const txStatus = useAppSelector((state) => state.multiops.tx.status);

  const onSubmit = (data: TxnBuilderForm) => {
    dispatch(
      txExecuteMultiMsg({
        basicChainInfo,
        aminoConfig: basicChainInfo.aminoConfig,
        denom: currency.coinMinimalDenom,
        feeAmount: data.fees,
        feegranter: '',
        memo: data.memo,
        msgs: data.msgs,
        prefix,
        rest,
        rpc,
        gas: data.gas,
        address,
      })
    );
  };

  const balance = useAppSelector(
    (state) => state.bank.balances?.[chainID]?.list
  );
  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(balance, currency.coinDecimals, currency.coinMinimalDenom)
      );
    }
  }, [balance]);

  useEffect(() => {
    if (chainID) {
      dispatch(
        getBalances({
          address,
          baseURL,
          baseURLs,
          chainID,
        })
      );
    }
  }, []);

  return (
    <TxnBuilder
      chainID={chainID}
      onSubmit={onSubmit}
      loading={txStatus === TxStatus.PENDING}
      fromAddress={address}
      availableBalance={availableBalance}
      isMultisig={false}
    />
  );
};
