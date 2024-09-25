import { useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

interface Action {
  trigger: string;
  placeholder: string;
}

const actions: Action[] = [
  { trigger: 'send', placeholder: 'send 1 ATOM to cosmos..... (from chainID [if it is IBC Transaction])' },
  { trigger: 'delegate', placeholder: 'delegate 1 ATOM to cosmosvaloper.....' },
];

const ChatInput = ({
  handleInputChange,
  userInput,
  disabled,
  handleSubmit,
}: {
  userInput: string;
  handleInputChange: (value: string) => void;
  disabled: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentSessionID = useAppSelector(
    (state) => state.agent.currentSessionID
  );
  const currentSession = useAppSelector((state) => state.agent.currentSession);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSessionID, currentSession]);
  const [placeholder, setPlaceholder] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange(value)

    // Find the first action that matches the input value
    const action = actions.find((a) => value.startsWith(a.trigger));
    if (action) {
      setPlaceholder(action.placeholder);
    } else {
      setPlaceholder('');
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={`p-5 w-full bg-[#09090A66] rounded-full flex items-center gap-3 transition-all duration-300 ${disabled ? 'opacity-55' : ''}`}
      >
        <div className="bg-[#FFFFFF1A] rounded-full w-6 h-6 flex items-center justify-center">
          <Image
            src="/interchain-agent/pen-icon.svg"
            width={15}
            height={15}
            alt="Chat"
          />
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            name="user-input"
            value={userInput}
            onChange={handleChange}
            className="input-box w-full bg-transparent border-none text-white outline-none placeholder-white"
            disabled={disabled}
            autoComplete="off"
            autoFocus={true}
            placeholder={'Message Interchain Agent'}
          />
        </div>
        <button type="submit" className="btn-bg w-6 rounded-full">
          <Image
            src="/interchain-agent/arrow-outlined-icon.svg"
            width={24}
            height={24}
            alt="Send"
          />
        </button>
      </form>

      {placeholder && (
        <div
          className="absolute left-0 bottom-[-1.5rem] text-xs text-gray-400 transition-opacity duration-300"
        >
          Hint: If you want to do a transaction, please use this format: &quot;{placeholder}&quot;
        </div>
      )}
    </div>
  );
};

export default ChatInput;
