import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  resetChat,
  setCurrentSessionID,
} from '@/store/features/interchain-agent/agentSlice';
import Image from 'next/image';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { clearChatHistory } from './storage';

interface AgentSidebarProps {
  sidebarOpen: boolean;
}

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const AgentSidebar = ({ sidebarOpen }: AgentSidebarProps) => {
  const dispatch = useAppDispatch();
  const startNewSession = () => {
    const newSessionID = uuidv4();
    dispatch(setCurrentSessionID(newSessionID));
  };
  const groupedChat = useAppSelector((state) => state.agent.groupedSessions);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const onSelectSession = (sessionID: string) => {
    dispatch(setCurrentSessionID(sessionID));
  };

  const onDeleteChat = () => {
    dispatch(resetChat());
    clearChatHistory();
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
              className="cursor-pointer"
              src={'/interchain-agent/solid-add-icon.svg'}
              width={32}
              height={32}
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
                          (
                            chatData: {
                              sessionID: string;
                              firstRequest: { key: string; value: any };
                            },
                            index: number
                          ) => {
                            const requestKey = chatData.firstRequest.key;
                            const parsedRequestKey = requestKey.substring(
                              0,
                              requestKey.lastIndexOf('_')
                            );
                            return (
                              <div className="w-full">
                                <button
                                  key={index}
                                  onClick={() =>
                                    onSelectSession(chatData.sessionID)
                                  }
                                  className={`block w-full text-white hover:font-medium rounded hover:cursor-pointer ${currentSessionID === chatData.sessionID ? 'font-semibold' : ''}`}
                                >
                                  <div className="text-[14px] leading-[18px] text-left truncate">
                                    {capitalizeFirstLetter(parsedRequestKey)}
                                  </div>
                                </button>
                              </div>
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
              <div className="text-[14px] font-thin">Export conversation</div>
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
