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
  showStopOption: boolean;
  handleStopGenerating: () => void;
  modelType: string;
  setModelType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isTxn: boolean;
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
  showStopOption,
  handleStopGenerating,
  isTxn,
  modelType,
  setModelType,
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
        <div className="flex items-center gap-4 h-[200px]">
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
          {/* <div className="text-[20px] font-bold text-white leading-8">
            Interchain Agent
          </div> */}

          <div className="space-y-2 w-full">
            <div>
              <select
                id="simple-dropdown"
                value={modelType}
                onChange={setModelType}
                className="bg-transparent border-[1px] border-[#ffffff14] rounded-xl p-2 "
              >
                <option value="" disabled>
                  Select Model
                </option>
                <option value="conversational">Conversational Model</option>
                <option value="transactional">Transactional Model</option>
              </select>
            </div>
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
                    <BotChat
                      status={value.status}
                      content={value.result}
                      isTxn={isTxn}
                    />
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef}></div>
            </>
          ) : (
            <div className="flex h-full flex-col justify-between items-center">
              <Header />
              <ChatSuggestions handleInputChange={handleInputChange} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {showStopOption && (
          <button onClick={handleStopGenerating} className="stop-btn">
            <Image
              src="/interchain-agent/stop-btn.svg"
              width={16}
              height={16}
              alt=""
            />
            <div>Stop Generating</div>
          </button>
        )}
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

const BotChat = ({
  content,
  status,
  isTxn,
}: {
  content: string;
  status: string;
  isTxn: boolean;
}) => {
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
        {status === 'pending' ? (
          <span>
            {isTxn ? 'Transaction pending ' : 'Querying '}{' '}
            <span className="dots-loader"></span>{' '}
          </span>
        ) : (
          <>
            <div className="text-[16px] font-light flex">
              <DisplayMarkdown content={content} />
              <CopyWithFeedback value={content} />
            </div>
          </>
        )}
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
