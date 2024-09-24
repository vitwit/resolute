import { useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSessionID]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-5 w-full bg-[#09090A66] rounded-full flex items-center gap-3 ${disabled ? 'opacity-45' : ''}`}
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
          onChange={(e) => handleInputChange(e.target.value)}
          className="input-box"
          disabled={disabled}
          autoComplete="off"
          autoFocus={true}
        />
      </div>
      <button type="submit" className="btn-bg w-6 rounded-full">
        <Image
          src="/interchain-agent/arrow-outlined-icon.svg"
          width={24}
          height={24}
          alt=""
        />
      </button>
    </form>
  );
};

export default ChatInput;
