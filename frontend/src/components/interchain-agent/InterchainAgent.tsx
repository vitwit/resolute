import React, { useEffect, useState } from 'react';
import ChatWidget, {
  Message as ChatMessage,
  TxnDetails,
} from 'interchain-agent-widget';
import { ARKA_BOT_CONFIG } from '@/constants/interchain-agent';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { TxStatus } from '@/types/enums';
import { getTxnURLOnResolute } from '@/utils/util';

const InterchainAgent = () => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getChainIDByCoinDenom, getDenomInfo } =
    useGetChainInfo();
  const { txSendInputs } = useGetTxInputs();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [txnStarted, setTxnStarted] = useState(false);
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const tx = useAppSelector((state) => state.common.txSuccess.tx);
  const [currentChainID, setCurrentChainID] = useState('');
  const [pendingMessageIndex, setPendingMessageIndex] = useState<number | null>(null); // To track the pending message index

  const handleTransactionParsed = (parsedTxn: TxnDetails) => {
    const chainID = getChainIDByCoinDenom(parsedTxn.denom);
    if (chainID.length === 0) return;
    setCurrentChainID(chainID);
    const { rpc, chainName } = getChainInfo(chainID);
    const { decimals, minimalDenom } = getDenomInfo(chainID);
    const txInputs = txSendInputs(
      chainID,
      parsedTxn.address,
      parsedTxn.amount,
      '',
      minimalDenom,
      decimals
    );

    setTxnStarted(true);
    dispatch(txBankSend({ ...txInputs, rpc }));

    // Add "Txn pending..." message and store its index
    setMessages((prevMessages) => {
      const newMessages: ChatMessage[] = [
        ...prevMessages,
        { sender: 'bot', text: 'Txn pending...' }, // Ensure it conforms to the ChatMessage type
      ];
      setPendingMessageIndex(newMessages.length - 1); // Store the index of the pending message
      return newMessages;
    });
  };

  useEffect(() => {
    if (txnStarted && currentChainID) {
      if (sendTxStatus === TxStatus.IDLE) {
        const { chainName } = getChainInfo(currentChainID);
        setTxnStarted(false);
        const txnStatus = 'Txn successful';
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (pendingMessageIndex !== null) {
            updatedMessages[pendingMessageIndex] = {
              ...updatedMessages[pendingMessageIndex],
              text: txnStatus,
              txnLink: getTxnURLOnResolute(chainName, tx?.transactionHash || ''),
            } as ChatMessage; // Type assertion for ChatMessage type
          }
          return updatedMessages;
        });
      } else if (sendTxStatus === TxStatus.REJECTED) {
        setTxnStarted(false);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (pendingMessageIndex !== null) {
            updatedMessages[pendingMessageIndex] = {
              ...updatedMessages[pendingMessageIndex],
              text: 'Txn Failed!',
            } as ChatMessage; // Type assertion for ChatMessage type
          }
          return updatedMessages;
        });
      }
    }
  }, [sendTxStatus, currentChainID, pendingMessageIndex]);

  return (
    <>
      <ChatWidget
        accessToken={ARKA_BOT_CONFIG.accessToken}
        apiUrl={ARKA_BOT_CONFIG.apiUrl}
        deploymentID={Number(ARKA_BOT_CONFIG.deploymentID)}
        planID={Number(ARKA_BOT_CONFIG.planID)}
        planOwner={ARKA_BOT_CONFIG.planOwner}
        refreshToken={ARKA_BOT_CONFIG.refreshToken}
        subscriber={ARKA_BOT_CONFIG.subscriber}
        theme={ARKA_BOT_CONFIG.theme}
        isLoading={sendTxStatus === TxStatus.PENDING}
        messages={messages}
        setMessages={setMessages}
        onTransactionParsed={handleTransactionParsed}
      />
    </>
  );
};

export default InterchainAgent;
