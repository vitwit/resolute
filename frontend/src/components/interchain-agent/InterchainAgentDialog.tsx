import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  addSessionItem,
  loadSessionStateFromLocalStorage,
  setCurrentSession,
  setCurrentSessionID,
  toggleAgentDialog,
} from '@/store/features/interchain-agent/agentSlice';
import React, { useEffect, useState } from 'react';
import AgentSidebar from './AgentSidebar';
import ChatComponent from './ChatComponent';
import { v4 as uuidv4 } from 'uuid';

interface InterchainAgentDialogProps {
  apiUrl: string;
  accessToken: string;
  refreshToken: string;
  deploymentID: number;
  planID: number;
  planOwner: string;
  subscriber: string;
}

const InterchainAgentDialog = ({
  accessToken,
  apiUrl,
  deploymentID,
  planID,
  planOwner,
  refreshToken,
  subscriber,
}: InterchainAgentDialogProps) => {
  const dispatch = useAppDispatch();
  const agentDialogOpen = useAppSelector((state) => state.agent.agentOpen);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [currentAccessToken, setCurrentAccessToken] =
    useState<string>(accessToken);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  useEffect(() => {
    dispatch(loadSessionStateFromLocalStorage());
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputDisabled(true);
    if (userInput.trim() !== '') {
      setInputDisabled(true);

      dispatch(
        addSessionItem({
          sessionID: currentSessionID,
          request: {
            [userInput]: {
              errMessage: '',
              result: '',
              status: 'pending',
              date: new Date().toISOString(),
            },
          },
        })
      );

      try {
        setUserInput('');
        let response = await fetch(`${apiUrl}`, {
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
        });

        if (!response.ok) {
          if (response.status === 401) {
            if (!isRefreshing) {
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
                });

                if (!response.ok) {
                  throw new Error('Failed to send message after token refresh');
                }
              } finally {
                setIsRefreshing(false);
              }
            }
          } else {
            throw new Error('Error in API request');
          }
        }

        let data = await response.json();

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
                  date: new Date().toISOString(),
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
                  date: new Date().toISOString(),
                },
              },
              sessionID: currentSessionID,
            })
          );
        }
      } catch (error) {
        let message: string = '';
        if (error instanceof Error) {
          message = error.message;
        } else {
          message = `unknown error ${error}`;
        }
        console.error('Failed to send message:', error);

        dispatch(
          addSessionItem({
            request: {
              [userInput]: {
                errMessage: 'Failed to send message',
                result: 'Failed to send message',
                status: 'failed',
                date: new Date().toISOString(),
              },
            },
            sessionID: currentSessionID,
          })
        );
      } finally {
        setInputDisabled(false);
      }

      setUserInput('');
    }
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
  };

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
          <AgentSidebar sidebarOpen={sidebarOpen} />
          <ChatComponent
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            toggleAgent={toggleAgent}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            userInput={userInput}
            disabled={inputDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default InterchainAgentDialog;
