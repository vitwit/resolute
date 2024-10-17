import { useEffect, useState } from 'react';
import useGetChainInfo from '../useGetChainInfo';
import { SendMsg } from '@/txns/bank';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import {
  resetGenericTxStatus,
  resetTxAndHash,
  setGenericTxStatus,
  txGeneric,
} from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import { addSessionItem } from '@/store/features/interchain-agent/agentSlice';
import { getTxnURLOnResolute } from '@/utils/util';
import { Delegate } from '@/txns/staking';
import useGetTxInputs from '../useGetTxInputs';
import {
  txTransfer,
  resetTxStatus as resetIBCTxStatus,
} from '@/store/features/ibc/ibcSlice';
import { txIBCSwap } from '@/store/features/swaps/swapsSlice';
import useAccount from '@/custom-hooks/useAccount';
import useChain from '@/custom-hooks/useChain';
import useSwaps from '@/custom-hooks/useSwaps';
import useGetChains from '@/custom-hooks/useGetChains';
// import useGetAssets from '@/custom-hooks/useGetAssets';

const SUPPORTED_TXNS = ['send', 'delegate', 'swap'];

const useTransactions = ({
  userInput,
  chatInputTime,
}: {
  userInput: string;
  chatInputTime: string;
}) => {
  // Get Signer
  const { getAccountAddress } = useAccount();

  // To fetch 4 rest endpoints from chain-registry
  const { getChainEndpoints, getExplorerEndpoints } = useChain();

  const { getSwapRoute, routeError } = useSwaps();

  const { chainsData } = useGetChains();

  // const { getTokensByChainID, srcAssetsLoading, destAssetLoading } =
  //   useGetAssets();

  const dispatch = useAppDispatch();
  const {
    getChainIDByCoinDenom,
    getDenomInfo,
    getChainInfo,
    getChainIDFromAddress,
  } = useGetChainInfo();
  const { txTransferInputs } = useGetTxInputs();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const supportedChainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const [currentChainID, setCurrentChainID] = useState('');

  const txStatus = useAppSelector((state) => state.common.genericTransaction);
  const tx = useAppSelector((state) => state.common.txSuccess.tx);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);
  const ibcTxError = useAppSelector((state) => state.ibc.txError);

  const validateParsedTxnData = ({
    parsedData,
  }: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parsedData: { type: string; data: any };
  }) => {
    setCurrentChainID('');
    if (!isWalletConnected) {
      return 'Please connect your wallet';
    }
    const providedChainID = parsedData?.data?.chainID;
    if (providedChainID) {
      if (supportedChainIDs.includes(providedChainID)) {
        setCurrentChainID(providedChainID);
      } else {
        setCurrentChainID('');
        return `Unsupported/Invalid chain ID: ${providedChainID}`;
      }
    }
    const chainID = getChainIDByCoinDenom(parsedData.data.denom);
    if (!providedChainID && chainID) {
      setCurrentChainID(chainID);
      if (!SUPPORTED_TXNS.includes(parsedData.type)) {
        return `Unsupported transaction type ${parsedData.type}`;
      }
    }
    if (!providedChainID && !chainID) {
      setCurrentChainID('');
      return 'No chains found with given denom';
    }
    if (parsedData.type === 'send' || parsedData.type === 'delegate') {
      const amount = parseFloat(parsedData.data.amount);
      if (isNaN(amount) || amount <= 0) {
        return `Invalid amount ${parsedData.data?.amount || ''}`;
      }
    }
    return '';
  };

  const initiateTransaction = async ({
    parsedData,
  }: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parsedData: { type: string; data: any };
  }) => {
    dispatch(resetIBCTxStatus());
    dispatch(resetTxAndHash());
    dispatch(resetGenericTxStatus());
    const chainID = getChainIDByCoinDenom(parsedData.data.denom);
    const providedChainID = parsedData?.data?.chainID;

    if (parsedData.type === 'send') {
      const destChainID = getChainIDFromAddress(parsedData.data?.address);
      // Normal send
      if (
        !providedChainID ||
        (providedChainID &&
          providedChainID === chainID &&
          destChainID === chainID)
      ) {
        const basicChainInfo = getChainInfo(chainID);
        const { decimals, minimalDenom } = getDenomInfo(chainID);
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
        // IBC Send
      } else {
        const { decimals, minimalDenom } = getDenomInfo(providedChainID);
        const toAddress = parsedData.data?.address;
        const amount = parseFloat(parsedData.data?.amount);
        const destChainID = getChainIDFromAddress(toAddress);
        if (!destChainID) {
          dispatch(
            setGenericTxStatus({
              status: TxStatus.REJECTED,
              errMsg: 'Invalid address',
            })
          );
          return;
        }
        const txInputs = txTransferInputs(
          providedChainID,
          destChainID,
          toAddress,
          amount,
          minimalDenom,
          decimals
        );
        dispatch(txTransfer(txInputs));
      }
    }
    if (parsedData.type === 'delegate') {
      const basicChainInfo = getChainInfo(chainID);
      const { decimals, minimalDenom } = getDenomInfo(chainID);
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
    if (parsedData.type === 'swap') {
      // IBC Swap via Interchain GPT bot
      const selectedSourceChain: any = {};
      const selectedDestChain: any = {};
      const supportedChains = chainsData;
      const sourceChain: any = supportedChains.find(
        (chain: any) =>
          chain.axelarChainName === parsedData.data.sourceChainName
      );

      // validate if source chain is supported
      if (sourceChain) {
        selectedSourceChain.chainID = sourceChain.chainId;
      }

      const destinationChain: any = supportedChains.find(
        (chain: any) =>
          chain.axelarChainName === parsedData.data.destinationChainName
      );

      // validate if destination chain is supported
      if (destinationChain) {
        selectedDestChain.chainID = destinationChain.chainId;
      }

      const { address: fromAddress } = await getAccountAddress(
        sourceChain.chainId || ''
      );
      const { address: toAddress } = await getAccountAddress(
        destinationChain.chainId || ''
      );

      const { rpcs, apis } = getChainEndpoints(
        selectedSourceChain?.chainID || ''
      );

      const { explorerEndpoint } = getExplorerEndpoints(
        selectedSourceChain?.chainID || ''
      );
      const { decimals } = getDenomInfo(selectedSourceChain.chainID);

      const { route } = await getSwapRoute({
        amount: Number(parsedData.data.amount) * 10 ** (decimals || 1),
        destChainID: selectedDestChain?.chainID || '',
        destDenom: `u${parsedData.data.destinationDenom}` || '',
        sourceChainID: selectedSourceChain?.chainID || '',
        sourceDenom: `u${parsedData.data?.denom}` || '',
        fromAddress,
        toAddress,
        slippage: Number(0.5),
      });
      console.log("swap router error ", routeError);
      
      if (routeError.length > 0) {
        dispatch(
          addSessionItem({
            request: {
              [userInput]: {
                errMessage: '',
                result: `Transaction failed: ${routeError}`,
                status: 'failed',
                date: chatInputTime,
              },
            },
            sessionID: currentSessionID,
          })
        );
        return;
      }

      if (route?.estimate) {
        dispatch(
          txIBCSwap({
            rpcURLs: rpcs,
            signerAddress: fromAddress,
            sourceChainID: selectedSourceChain?.chainID || '',
            destChainID: selectedDestChain?.chainID || '',
            swapRoute: route,
            explorerEndpoint,
            baseURLs: apis,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (txStatus.status === TxStatus.IDLE) {
      const { chainName } = getChainInfo(currentChainID);
      console.log('here1...', tx?.transactionHash);
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
      console.log('here2..', tx?.transactionHash);
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

  useEffect(() => {
    if (
      ibcTxStatus === TxStatus.IDLE &&
      tx?.transactionHash &&
      userInput?.length
    ) {
      const { chainName } = getChainInfo(currentChainID);
      console.log('here3...', tx?.transactionHash);
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
      dispatch(setGenericTxStatus({ status: TxStatus.IDLE, errMsg: '' }));
    } else if (ibcTxStatus === TxStatus.REJECTED && userInput?.length) {
      console.log('here4...', tx?.transactionHash);
      dispatch(
        addSessionItem({
          request: {
            [userInput]: {
              errMessage: '',
              result: `Transaction failed`,
              status: 'failed',
              date: chatInputTime,
            },
          },
          sessionID: currentSessionID,
        })
      );
      dispatch(
        setGenericTxStatus({ status: TxStatus.REJECTED, errMsg: ibcTxError })
      );
    }
  }, [tx, ibcTxStatus]);

  return { validateParsedTxnData, initiateTransaction };
};

export default useTransactions;
