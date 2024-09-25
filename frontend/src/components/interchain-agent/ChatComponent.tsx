import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import Header from './Header';
import CopyWithFeedback from './CopyWithFeedback';

interface ChatComponentProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  toggleAgent: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (value: string) => void;
  userInput: string;
  disabled: boolean;
  isNew: boolean;
}

const ChatComponent = ({
  toggleSidebar,
  sidebarOpen,
  toggleAgent,
  handleInputChange,
  handleSubmit,
  userInput,
  disabled,
  isNew,
}: ChatComponentProps) => {
  const currentSession = useAppSelector((state) => state.agent.currentSession);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever currentSession.requests updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.requests]);

  return (
    <div className="flex-1 w-full h-full p-10 flex flex-col gap-10">
      <div className="flex items-center w-full justify-between h-8">
        <div className="flex items-center gap-4">
          {isNew ? null : (
            <Image
              onClick={toggleSidebar}
              className={`cursor-pointer ${sidebarOpen ? '' : 'rotate-180'}`}
              src={'/interchain-agent/solid-arrow-icon.svg'}
              width={24}
              height={24}
              alt=""
            />
          )}
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
          className={`flex-1 overflow-y-scroll space-y-6 max-w-[750px] ${sidebarOpen ? 'w-full' : 'w-[70%]'}`}
        >
          {currentSession &&
            Object.keys(currentSession?.requests).length > 0 ? (
            <>
              {Object.entries(currentSession.requests).map(([key, value]) => {
                const parsedKey = key.substring(0, key.lastIndexOf('_'));
                return (
                  <React.Fragment key={key}>
                    <UserChat content={parsedKey} />
                    <BotChat status={value.status} content={value.result} />
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef}></div>
            </>
          ) : (
            <div className="flex h-full flex-col justify-between items-center">
              <Header />
              <ChatSuggestions />
            </div>
          )}
        </div>
      </div>

      <div>
        <ChatInput
          handleInputChange={handleInputChange}
          disabled={disabled}
          userInput={userInput}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatComponent;

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-[#09090A] rounded-2xl w-fit max-w-[60%] p-4">
        <DisplayMarkdown content={content} />
      </div>
    </div>
  );
};

const BotChat = ({ content, status }: { content: string, status: string }) => {
  return (
    <div className="flex gap-[10px] items-start">
      <Image
        src="/interchain-agent-logo-vitwit.svg"
        height={24}
        width={24}
        alt=""
        draggable={false}
      />
      <div className="space-y-2 max-w-full overflow-x-scroll">
        {
          status === 'pending' ? 'querying....': <>
            <div className="text-[16px] font-light flex">
              <DisplayMarkdown content={content} />
              <CopyWithFeedback value={content} />
            </div>
          </>
        }
      </div>
    </div>
  );
};

const DisplayMarkdown = ({ content }: { content: string }) => {
  return (
    <div
      className="chat-markdown"
      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
    >
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
};
