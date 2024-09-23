import Image from 'next/image';
import React from 'react';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

interface ChatComponentProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  toggleAgent: () => void;
}

const sampleChat = [
  { from: 'user', content: 'What is Cosmos SDK' },
  {
    from: 'bot',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique animi deserunt enim ipsa. Autem qui blanditiis maiores itaque. Voluptas, porro.',
  },
  { from: 'user', content: 'What is Cosmos SDK' },
  {
    from: 'bot',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique animi deserunt enim ipsa. Autem qui blanditiis maiores itaque. Voluptas, porro.',
  },
  { from: 'user', content: 'What is Cosmos SDK' },
  {
    from: 'bot',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique animi deserunt enim ipsa. Autem qui blanditiis maiores itaque. Voluptas, porro.',
  },
];

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
      <div className="flex-1 overflow-y-scroll flex flex-col gap-6 items-center justify-center">
        <div
          className={`flex-1 overflow-y-scroll space-y-6 ${sidebarOpen ? 'w-full' : 'w-[70%]'}`}
        >
          {/* <ChatSuggestions /> */}
          {sampleChat.map((chat) => (
            <>
              {chat.from === 'user' ? (
                <UserChat content={chat.content} />
              ) : (
                <BotChat content={chat.content} />
              )}
            </>
          ))}
          {sampleChat.map((chat) => (
            <>
              {chat.from === 'user' ? (
                <UserChat content={chat.content} />
              ) : (
                <BotChat content={chat.content} />
              )}
            </>
          ))}
          {sampleChat.map((chat) => (
            <>
              {chat.from === 'user' ? (
                <UserChat content={chat.content} />
              ) : (
                <BotChat content={chat.content} />
              )}
            </>
          ))}
          {sampleChat.map((chat) => (
            <>
              {chat.from === 'user' ? (
                <UserChat content={chat.content} />
              ) : (
                <BotChat content={chat.content} />
              )}
            </>
          ))}
        </div>
      </div>

      <div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatComponent;

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-[#09090A] rounded-2xl w-fit max-w-[60%] p-4">
        {content}
      </div>
    </div>
  );
};

const BotChat = ({ content }: { content: string }) => {
  return (
    <div className="flex gap-[10px] items-start">
      <Image
        src="/interchain-agent-logo-vitwit.svg"
        height={24}
        width={24}
        alt=""
      />
      <div className="space-y-2">
        <div className="text-[16px] font-light">{content}</div>
        <button>
          <Image
            src="/interchain-agent/copy-icon.svg"
            height={20}
            width={20}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};
