import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  addSessionItem,
  loadSessionStateFromLocalStorage,
  setCurrentSession,
  setCurrentSessionID,
  toggleAgentDialog,
} from '@/store/features/interchain-agent/agentSlice';
import React, { useEffect, useRef, useState } from 'react';
import AgentSidebar from './AgentSidebar';
import ChatComponent from './ChatComponent';
import { v4 as uuidv4 } from 'uuid';
import useTransactions from '@/custom-hooks/interchain-agent/useTransactions';
import { TxStatus } from '@/types/enums';
import { resetGenericTxStatus } from '@/store/features/common/commonSlice';
import useGetChains from '@/custom-hooks/useGetChains';

interface InterchainAgentDialogProps {
  apiUrl: string;
  accessToken: string;
  refreshToken: string;
  deploymentID: number;
  planID: number;
  planOwner: string;
  subscriber: string;
  conversationalModelURL: string;
  transactionalModelURL: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function parseTransaction(input: string): { type: string; data: any } | null {
  // Regex for "send <amount> <denom> to <address> from <chainID>"
  const regexWithChainID =
    /^(\w+)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+to\s+([a-zA-Z0-9]+)\s+from\s+([\w-]+)$/i;

  // Regex for "send <amount> <denom> to <address>"
  const regexWithoutChainID =
    /^(\w+)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+to\s+([a-zA-Z0-9]+)$/i;

  // Regex for "swap <amount> <denom> of <chainID> to <denom> of <chainID>"
  const regexForIBCSwap =
    /^(\w+)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+of\s+([\w-]+)\s+to\s+(\w+)\s+of\s+([\w-]+)$/i;

  // Regex for "fetch proposals for <chainID>"
  const regexForFetchProposals = /^(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)$/i;

  // Regex for "vote "
  const regexForVoteProposal =
    /^(\w+)\s+(\w+)\s+(\w+)\s+id\s+(\d+)\s+(\w+)\s+([\w-]+)\s+(\w+)\s+(\d+(?:\.\d+)?\s*\w+)$/i;

  let match;

  // First, check for the regex with chainID
  match = input.match(regexWithChainID);
  if (match) {
    const [
      ,
      typeWithChainID,
      amountWithChainID,
      denomWithChainID,
      addressWithChainID,
      chainID,
    ] = match;
    return {
      type: typeWithChainID,
      data: {
        amount: amountWithChainID,
        denom: denomWithChainID.toUpperCase(),
        address: addressWithChainID,
        chainID: chainID,
      },
    };
  }

  // Then, check for the regex without chainID
  match = input.match(regexWithoutChainID);
  if (match) {
    const [
      ,
      typeWithoutChainID,
      amountWithoutChainID,
      denomWithoutChainID,
      addressWithoutChainID,
    ] = match;
    return {
      type: typeWithoutChainID,
      data: {
        amount: amountWithoutChainID,
        denom: denomWithoutChainID.toUpperCase(),
        address: addressWithoutChainID,
      },
    };
  }

  // Check for regex with IBC Swap
  match = input.match(regexForIBCSwap);
  if (match) {
    const [
      ,
      typeWithoutChainID,
      amount,
      sourceDenom,
      sourceChainName,
      destinationDenom,
      destinationChainName,
    ] = match;

    return {
      type: typeWithoutChainID,
      data: {
        amount: amount,
        denom: sourceDenom.toLowerCase(),
        sourceChainName: sourceChainName.toLowerCase(),
        destinationDenom: destinationDenom.toLowerCase(),
        destinationChainName: destinationChainName.toLowerCase(),
      },
    };
  }

  // Check for fetch Proposals regex
  match = input.match(regexForFetchProposals);
  if (match) {
    const [, typeWithoutChainID, , , chainId] = match;
    return {
      type: typeWithoutChainID,
      data: {
        chainId,
      },
    };
  }

  // Check for voteProposal regex
  match = input.match(regexForVoteProposal);
  if (match) {
    const [, typeWithoutChainID, voteOption, proposalID, chainId, gasPrice] =
      match;

    return {
      type: typeWithoutChainID,
      data: {
        voteOption,
        proposalID,
        chainId,
        gasPrice,
      },
    };
  }

  // If no pattern is matched, return null
  return null;
}

const InterchainAgentDialog = ({
  accessToken,
  apiUrl,
  deploymentID,
  planID,
  planOwner,
  refreshToken,
  subscriber,
  conversationalModelURL,
}: InterchainAgentDialogProps) => {
  const dispatch = useAppDispatch();
  const { chainsData } = useGetChains();
  const agentDialogOpen = useAppSelector((state) => state.agent.agentOpen);
  const govState = useAppSelector((state) => state.gov.chains);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const groupedChat = useAppSelector((state) => state.agent.groupedSessions);
  const isNew = Object.keys(groupedChat).length === 0;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelType, setModelType] = useState('conversational');
  const [userInput, setUserInput] = useState('');
  const [chatInputTime, setChatInputTime] = useState<string>('');
  const [isTxn, setIsTxn] = useState(false);

  const { validateParsedTxnData, initiateTransaction } = useTransactions({
    userInput,
    chatInputTime,
  });

  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [currentAccessToken, setCurrentAccessToken] =
    useState<string>(accessToken);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const txStatus = useAppSelector((state) => state.common.genericTransaction);

  const resetInputState = () => {
    setUserInput('');
    setInputDisabled(false);
  };

  const refreshTokenRequest = async () => {
    try {
      const response = await fetch(`${apiUrl}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      setCurrentAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      } else {
        throw new Error(`unknown error ${error}`);
      }
    }
  };

  const dispatchSessionItem = (
    userInput: string,
    status: string,
    result: string,
    errMessage: string
  ) => {
    dispatch(
      addSessionItem({
        request: {
          [userInput]: {
            errMessage,
            result,
            status,
            date: chatInputTime,
          },
        },
        sessionID: currentSessionID,
      })
    );
  };

  const abortControllerRef = useRef<AbortController | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    setIsTxn(false);
    e.preventDefault();
    setInputDisabled(true);
    dispatch(resetGenericTxStatus());
    const currentDate = new Date().toISOString();
    setChatInputTime(currentDate);

    if (userInput.trim() !== '') {
      // Reset the abort controller before starting a new request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController and store it in the ref
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const signal = abortController.signal;

      setInputDisabled(true);

      dispatch(
        addSessionItem({
          sessionID: currentSessionID,
          request: {
            [userInput]: {
              errMessage: '',
              result: '',
              status: 'pending',
              date: currentDate,
            },
          },
        })
      );

      const parsedTransaction = parseTransaction(userInput.trim());
      if (parsedTransaction?.type === 'fetch') {
        setIsTxn(false);
        const chainDetails: any = chainsData.find(
          (chain: any) =>
            chain.axelarChainName === parsedTransaction.data?.chainId
        );

        const activeProposals =
          govState?.[chainDetails?.chainId]?.active?.proposals || [];
        // const depositProposals =
        //   govState?.[chainDetails?.chainId]?.deposit?.proposals || [];
        // console.log('activeProposals is ', activeProposals, depositProposals);
        if (activeProposals.length > 0) {
          dispatch(
            addSessionItem({
              request: {
                [userInput]: {
                  errMessage: '',
                  result: activeProposals[0].content?.title || '',
                  status: 'fetched',
                  date: currentDate,
                },
              },
              sessionID: currentSessionID,
            })
          );
        }
        setInputDisabled(false);
        return;
      }
      if (parsedTransaction) {
        setIsTxn(true);
        const error = validateParsedTxnData({ parsedData: parsedTransaction });
        if (error.length) {
          dispatchSessionItem(userInput, 'error', error, error);
          resetInputState();
          return;
        }
        initiateTransaction({ parsedData: parsedTransaction });
        return;
      }

      try {
        setUserInput('');
        let response = await fetch(conversationalModelURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${currentAccessToken}`,
          },
          body: JSON.stringify({
            // deployment_id: deploymentID,
            // plan_id: planID,
            // subscriber: subscriber,
            // plan_owner: planOwner,
            // request: { request: userInput },
            request: userInput,
          }),
          signal,
        });

        if (!response.ok) {
          if (response.status === 401 && !isRefreshing) {
            setIsRefreshing(true);
            try {
              const newToken = await refreshTokenRequest();
              setCurrentAccessToken(newToken);

              response = await fetch(`${apiUrl}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                },
                body: JSON.stringify({
                  deployment_id: deploymentID,
                  plan_id: planID,
                  subscriber: subscriber,
                  plan_owner: planOwner,
                  request: { request: userInput },
                }),
                signal,
              });

              if (!response.ok) {
                throw new Error('Failed after token refresh');
              }
            } finally {
              setIsRefreshing(false);
            }
          } else {
            throw new Error('Error in API request');
          }
        }

        let data = await response.json();

        // Polling for pending status
        while (data.status === 'pending' || data.result === '') {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          response = await fetch(`${apiUrl}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentAccessToken}`,
            },
            body: JSON.stringify({
              deployment_id: deploymentID,
              plan_id: planID,
              subscriber: subscriber,
              plan_owner: planOwner,
              request: { request: userInput },
            }),
            signal,
          });

          if (!response.ok) {
            throw new Error('Error in API request during polling');
          }

          data = await response.json();
        }

        if (data.status === 'success') {
          dispatch(
            addSessionItem({
              request: {
                [userInput]: {
                  errMessage: '',
                  result: data.result,
                  status: 'success',
                  date: currentDate,
                },
              },
              sessionID: currentSessionID,
            })
          );
        } else if (data.status === 'error') {
          dispatch(
            addSessionItem({
              request: {
                [userInput]: {
                  errMessage: 'Error processing request.',
                  result: 'Error processing request.',
                  status: 'failed',
                  date: currentDate,
                },
              },
              sessionID: currentSessionID,
            })
          );
        }
      } catch (error) {
        if (signal.aborted) {
          dispatch(
            addSessionItem({
              request: {
                [userInput]: {
                  errMessage: 'Request cancelled',
                  result: 'Request cancelled',
                  status: 'failed',
                  date: currentDate,
                },
              },
              sessionID: currentSessionID,
            })
          );
        } else {
          const message =
            error instanceof Error ? error.message : `unknown error ${error}`;
          console.error('Failed to send message:', message);
          const eMsg = 'Agent is offline or request failed.';

          dispatch(
            addSessionItem({
              request: {
                [userInput]: {
                  errMessage: eMsg,
                  result: eMsg,
                  status: 'failed',
                  date: currentDate,
                },
              },
              sessionID: currentSessionID,
            })
          );
        }
      } finally {
        abortControllerRef.current = null;
        setInputDisabled(false);
      }
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
  };

  useEffect(() => {
    if (agentDialogOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [agentDialogOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleAgent = () => {
    dispatch(toggleAgentDialog());
  };

  useEffect(() => {
    if (agentDialogOpen) {
      const newSessionID = uuidv4();
      dispatch(setCurrentSessionID(newSessionID));
      setUserInput('');
      setInputDisabled(false);
    }
  }, [agentDialogOpen]);

  useEffect(() => {
    if (currentSessionID) {
      setUserInput('');
      setInputDisabled(false);
      const storedState = localStorage.getItem('queries');
      if (storedState) {
        const parsed = JSON.parse(storedState);
        if (parsed[currentSessionID]) {
          dispatch(setCurrentSession({ data: parsed }));
          dispatch(
            setCurrentSession({
              data: parsed[currentSessionID],
            })
          );
        } else {
          dispatch(
            setCurrentSession({
              data: {
                date: new Date().toISOString(),
                requests: {},
              },
            })
          );
        }
      } else {
        dispatch(
          setCurrentSession({
            data: {
              date: new Date().toISOString(),
              requests: {},
            },
          })
        );
      }
    } else {
      dispatch(
        setCurrentSession({
          data: {
            date: new Date().toISOString(),
            requests: {},
          },
        })
      );
    }
  }, [currentSessionID]);

  // useEffect(() => {
  //   if(inputDisabled) {}
  // }, [currentSessionID, inputDisabled])

  useEffect(() => {
    dispatch(loadSessionStateFromLocalStorage());
  }, []);

  useEffect(() => {
    if (
      txStatus.status === TxStatus.IDLE ||
      txStatus.status === TxStatus.REJECTED
    ) {
      resetInputState();
      dispatch(resetGenericTxStatus());
    }
  }, [txStatus]);

  if (!agentDialogOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex justify-center items-center p-10 bg-[#09090ACC] z-[99999999]"
      onClick={() => dispatch(toggleAgentDialog())}
    >
      <div
        className="bg-[#1C1C1D] h-[750px] max-h-[calc(100vh-80px)] w-full max-w-[1200px] rounded-3xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full h-full">
          {isNew ? null : (
            <AgentSidebar
              sidebarOpen={sidebarOpen}
              isLoading={inputDisabled}
              handleStopGenerating={handleStopGenerating}
            />
          )}
          <ChatComponent
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            toggleAgent={toggleAgent}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            userInput={userInput}
            disabled={inputDisabled}
            isNew={isNew}
            showStopOption={!isTxn && inputDisabled}
            handleStopGenerating={handleStopGenerating}
            isTxn={isTxn}
            setModelType={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setModelType(e.target.value);
            }}
            modelType={modelType}
          />
          {/* <button onClick={handleStopGenerating}>stop...</button> */}
        </div>
      </div>
    </div>
  );
};

export default InterchainAgentDialog;
