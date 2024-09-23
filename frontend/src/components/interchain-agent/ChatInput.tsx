import Image from 'next/image';
import React from 'react';

const ChatInput = () => {
  return (
    <div className="p-5 w-full bg-[#09090A66] rounded-full flex items-center gap-3">
      <div className="bg-[#FFFFFF1A] rounded-full w-6 h-6 flex items-center justify-center">
        <Image
          src="/interchain-agent/pen-icon.svg"
          width={15}
          height={15}
          alt="Chat"
        />
      </div>
      <div className="flex-1">
        <input className="input-box" />
      </div>
      <button className="btn-bg w-6 rounded-full">
        <Image
          src="/interchain-agent/arrow-outlined-icon.svg"
          width={24}
          height={24}
          alt=""
        />
      </button>
    </div>
  );
};

export default ChatInput;
