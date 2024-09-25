import React, { useEffect, useState } from 'react';
import useGetChainInfo from '../useGetChainInfo';
import { SendMsg } from '@/txns/bank';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import { txGeneric } from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import { addSessionItem } from '@/store/features/interchain-agent/agentSlice';
import { getTxnURLOnResolute } from '@/utils/util';
import { Delegate } from '@/txns/staking';

const SUPPORTED_TXNS = ['send', 'delegate'];

const useTransactions = ({
  userInput,
  chatInputTime,
}: {
  userInput: string;
  chatInputTime: string;
}) => {
  const dispatch = useAppDispatch();
  const { getChainIDByCoinDenom, getDenomInfo, getChainInfo } =
    useGetChainInfo();

  const [currentChainID, setCurrenChainID] = useState('');

  const txStatus = useAppSelector((state) => state.common.genericTransaction);
  const tx = useAppSelector((state) => state.common.txSuccess.tx);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const validateParsedTxnData = ({
    parsedData,
  }: {
    parsedData: { type: string; data: any };
  }) => {
    setCurrenChainID('');
    if (!isWalletConnected) {
      return 'Please connect your wallet';
    }
    const chainID = getChainIDByCoinDenom(parsedData.data.denom);
    if (chainID) {
      setCurrenChainID(chainID);
      if (!SUPPORTED_TXNS.includes(parsedData.type)) {
        return `Unsupported transaction type ${parsedData.type}`;
      }
      if (parsedData.type === 'send' || parsedData.type === 'delegate') {
        const amount = parseFloat(parsedData.data.amount);
        if (isNaN(amount) || amount <= 0) {
          return `Invalid amount ${parsedData.data?.amount || ''}`;
        }
      }
      return '';
    }
    return 'No chains found with given denom';
  };

  const initiateTransaction = ({
    parsedData,
  }: {
    parsedData: { type: string; data: any };
  }) => {
    const chainID = getChainIDByCoinDenom(parsedData.data.denom);
    const basicChainInfo = getChainInfo(chainID);
    const { decimals, minimalDenom } = getDenomInfo(chainID);
    if (parsedData.type === 'send') {
      const toAddress = parsedData.data?.address;
      const amount = parseFloat(parsedData.data?.amount);
      const msg = SendMsg(
        basicChainInfo.address,
        toAddress,
        amount * 10 ** decimals,
        minimalDenom
      );
      dispatch(
        txGeneric({
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          feegranter: '',
        })
      );
    }
    if (parsedData.type === 'delegate') {
      const valAddress = parsedData.data?.address;
      const amount = parseFloat(parsedData.data?.amount);
      const msg = Delegate(
        basicChainInfo.address,
        valAddress,
        amount * 10 ** decimals,
        minimalDenom
      );
      dispatch(
        txGeneric({
          basicChainInfo,
          msgs: [msg],
          memo: '',
          denom: minimalDenom,
          feegranter: '',
        })
      );
    }
  };

  useEffect(() => {
    if (txStatus.status === TxStatus.IDLE) {
      const { chainName } = getChainInfo(currentChainID);
      dispatch(
        addSessionItem({
          request: {
            [userInput]: {
              errMessage: '',
              result: `Transaction successful: [View here](${getTxnURLOnResolute(chainName, tx?.transactionHash || '')})`,
              status: 'success',
              date: chatInputTime,
            },
          },
          sessionID: currentSessionID,
        })
      );
    } else if (txStatus.status === TxStatus.REJECTED) {
      dispatch(
        addSessionItem({
          request: {
            [userInput]: {
              errMessage: '',
              result: `Transaction failed: ${txStatus.errMsg}`,
              status: 'failed',
              date: chatInputTime,
            },
          },
          sessionID: currentSessionID,
        })
      );
    }
  }, [tx, txStatus]);

  return { validateParsedTxnData, initiateTransaction };
};

export default useTransactions;
