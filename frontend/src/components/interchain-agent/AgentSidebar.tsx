import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  loadSessionStateFromLocalStorage,
  resetChat,
  setCurrentSessionID,
} from '@/store/features/interchain-agent/agentSlice';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { clearChatHistory, deleteSessionFromLocalStorage } from './storage';

interface AgentSidebarProps {
  sidebarOpen: boolean;
  isLoading: boolean;
  handleStopGenerating: () => void;
}

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const AgentSidebar = ({
  sidebarOpen,
  isLoading,
  handleStopGenerating,
}: AgentSidebarProps) => {
  const dispatch = useAppDispatch();
  const startNewSession = () => {
    if (isLoading) return;
    const newSessionID = uuidv4();
    dispatch(setCurrentSessionID(newSessionID));
  };
  const groupedChat = useAppSelector((state) => state.agent.groupedSessions);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const onSelectSession = (sessionID: string) => {
    if (isLoading) return;
    dispatch(setCurrentSessionID(sessionID));
  };

  const onDeleteChat = () => {
    if (isLoading) {
      handleStopGenerating();
    }
    dispatch(resetChat());
    clearChatHistory();
  };

  const onDeleteSession = async (sessionID: string) => {
    await deleteSessionFromLocalStorage(sessionID);
    dispatch(loadSessionStateFromLocalStorage());
  };

  return (
    <div
      className={`h-full bg-[#09090A66] transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-[300px] p-10 pb-6' : 'w-0 p-0'
      }`}
    >
      {sidebarOpen && (
        <div className="opacity-100 transition-opacity duration-500 flex flex-col h-full gap-6">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-[18px]">Chats</div>
            <Image
              onClick={startNewSession}
              className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              src={'/interchain-agent/solid-add-icon.svg'}
              width={24}
              height={24}
              alt=""
            />
          </div>
          <div className="flex-1 overflow-y-scroll">
            <div className="space-y-4">
              {Object.keys(groupedChat).map((date, index) => {
                return (
                  <div className="space-y-4" key={index}>
                    <div className="text-[12px] font-extralight border-b-[1px] border-[#ffffff29] pb-2">
                      {date}
                    </div>
                    <div className="space-y-4">
                      {groupedChat?.[date]
                        ?.slice()
                        .reverse()
                        .map(
                          (chatData: {
                            sessionID: string;
                            /* eslint-disable @typescript-eslint/no-explicit-any */
                            firstRequest: { key: string; value: any };
                          }) => {
                            const requestKey = chatData.firstRequest.key;
                            const parsedRequestKey = requestKey.substring(
                              0,
                              requestKey.lastIndexOf('_')
                            );
                            return (
                              <SessionItem
                                key={chatData.sessionID}
                                isLoading={isLoading}
                                onSelectSession={() => {
                                  onSelectSession(chatData.sessionID);
                                }}
                                requestKey={capitalizeFirstLetter(
                                  parsedRequestKey
                                )}
                                isSelected={
                                  currentSessionID === chatData.sessionID
                                }
                                onDeleteSession={() => {
                                  onDeleteSession(chatData.sessionID);
                                }}
                              />
                            );
                          }
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t-[1px] border-[#ffffff29] pt-2">
            <button className="py-[10px] px-2 flex items-center gap-2">
              <Image
                src="/interchain-agent/export-icon.svg"
                height={20}
                width={20}
                alt=""
              />
              <div className="text-[14px] font-thin opacity-40 cursor-not-allowed">Export conversation</div>
            </button>
            <button
              onClick={onDeleteChat}
              className="py-[10px] px-2 flex items-center gap-2"
            >
              <Image
                src="interchain-agent/delete-icon.svg"
                height={20}
                width={20}
                alt=""
              />
              <div className="text-[14px] font-thin">Delete conversation</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSidebar;

const SessionItem = ({
  onSelectSession,
  onDeleteSession, // New prop for delete action
  requestKey,
  isLoading,
  isSelected,
}: {
  onSelectSession: () => void;
  onDeleteSession: () => void; // New prop type
  requestKey: string;
  isLoading: boolean;
  isSelected: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle menu
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative flex gap-1 justify-between">
      <button
        onClick={onSelectSession}
        className={`flex-1 w-full truncate text-white hover:font-medium rounded ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'font-semibold' : ''}`}
      >
        <div className="text-[14px] leading-[18px] text-left truncate">
          {requestKey}
        </div>
      </button>

      <button onClick={handleMenuToggle}>
        <Image
          src="/interchain-agent/menu-icon.svg"
          height={16}
          width={16}
          alt=""
        />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-40 bg-[#444444] rounded-xl shadow-lg z-[99999]"
        >
          <button
            onClick={onDeleteSession}
            className="block w-full text-left px-4 py-2 hover:bg-[#ffffff0b] text-[12px]"
          >
            Delete Session
          </button>
        </div>
      )}
    </div>
  );
};
