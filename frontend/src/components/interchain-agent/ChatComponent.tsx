import Image from 'next/image';
import React from 'react';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

interface ChatComponentProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  toggleAgent: () => void;
}

const ChatComponent = ({
  toggleSidebar,
  sidebarOpen,
  toggleAgent,
}: ChatComponentProps) => {
  return (
    <div className="flex-1 w-full h-full p-10 flex flex-col gap-10">
      <div className="flex items-center w-full justify-between h-8">
        <div className="flex items-center gap-4">
          <Image
            onClick={toggleSidebar}
            className={`cursor-pointer ${sidebarOpen ? '' : 'rotate-180'}`}
            src={'/interchain-agent/solid-arrow-icon.svg'}
            width={24}
            height={24}
            alt=""
          />
          <div className="text-[26px] font-bold text-white leading-8">
            Interchain Agent
          </div>
        </div>
        <div>
          <Image
            onClick={toggleAgent}
            className="cursor-pointer"
            src={'/interchain-agent/solid-cancel-icon.svg'}
            width={32}
            height={32}
            alt=""
          />
        </div>
      </div>
      <div className="flex-1">
        <ChatSuggestions />
      </div>
      <div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatComponent;
